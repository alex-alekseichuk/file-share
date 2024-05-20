import { PassThrough, Readable } from 'stream'
import fs from "node:fs"
import path from "node:path";
import unzipper from 'unzipper'
import archiver from 'archiver'
import {config} from '../config.js'

function bufferToStream(buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', data => {
            if (typeof data === 'string') {
                // Convert string to Buffer assuming UTF-8 encoding
                chunks.push(Buffer.from(data, 'utf-8'));
            } else if (data instanceof Buffer) {
                chunks.push(data);
            } else {
                // Convert other data types to JSON and then to a Buffer
                const jsonData = JSON.stringify(data);
                chunks.push(Buffer.from(jsonData, 'utf-8'));
            }
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

export function createFilesService(api) {
    async function fetchFiles() {
        return await api.prisma.file.findMany({})
    }

    async function unzipArchive(buffer) {
        const stream = bufferToStream(buffer)
        const zip = stream.pipe(unzipper.Parse({forceStream: true}))
        for await (const entry of zip) {
            const filename = entry.path
            const size = entry.vars.uncompressedSize // There is also compressedSize;
            if (entry.type === 'File') { // 'Directory' or 'File'
                entry.pipe(fs.createWriteStream(path.join(config.filesDir, filename)))
                await api.prisma.file.upsert({
                    where: { filename },
                    update: {size},
                    create: {
                        filename,
                        size,
                    },
                })
            } else {
                entry.autodrain()
            }
        }
    }

    async function zipArchive(fileIds) {
        const passthrough = new PassThrough()

        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        })

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        })

        archive.on('error', (err) => {
            throw err;
        })

        archive.pipe(passthrough)

        const files = await api.prisma.file.findMany({where: {id: {in: fileIds}}})

        for (const file of files) {
            archive.append(fs.createReadStream(path.join(config.filesDir, file.filename)), {name: file.filename});
        }

        archive.finalize()
        const buffer = streamToBuffer(passthrough)

        return buffer
    }

    return {
        fetchFiles,
        unzipArchive,
        zipArchive,
    }
}