import { fileURLToPath } from 'node:url'
import { dirname as _dirname } from 'node:path'
import path from "node:path"

const filename = () => fileURLToPath(import.meta.url + '/..')
const dirname = () => _dirname(filename())

const appDir = _dirname(fileURLToPath(import.meta.url))

export const config = {
    appDir,
    filesDir: process.env.FILES_DIR ?? path.join(appDir, 'static', 'files')
}
