import path from "node:path"

import Fastify from 'fastify'
// import {staticPath, adminDir, makeUrl} from './common/utils.js'

import fastifyPrismaClient from 'fastify-prisma-client'

import fastifyMultipart from '@fastify/multipart'

import fastifyCors from '@fastify/cors'

import fastifyStatic from '@fastify/static'
import {config} from './config.js'
import {createFilesService} from './api/files.service.js'

// const filesDir = staticPath(process.env.FILES_DIR || 'files')

export async function build() {
    const fastify = Fastify({
        logger: {
            transport: {
                target: "@fastify/one-line-logger",
            }
        }
    })

    fastify.register(fastifyCors, {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    });

    fastify.register(fastifyMultipart, {
        attachFieldsToBody: 'keyValues',
        limits: {
            fieldNameSize: 100,      // Max field name size in bytes
            fieldSize: 1_000_000,    // Max field value size in bytes
            fields: 50,              // Max number of non-file fields
            fileSize: 10_000_000,    // For multipart forms, the max file size in bytes
            files: 2,                // Max number of file fields
            headerPairs: 2000,       // Max number of header key=>value pairs
            parts: 1000              // For multipart forms, the max number of parts (fields + files)
        }
    })

    fastify.register(fastifyPrismaClient, {
        log: ['query', 'info', 'warn', 'error'],
    })

    fastify.register(fastifyStatic, {
        root: path.join(config.appDir, 'static'),
        prefix: '',
    })

    fastify.get('/ping', async (req, res) => {
        res.send({})
    })

    fastify.decorate('filesService', createFilesService(fastify))
    fastify.register(import('./api/files.routes.js'), {prefix: 'api'})

    return fastify
}