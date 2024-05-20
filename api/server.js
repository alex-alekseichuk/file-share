import { build } from './app.js'

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const host = process.env.HOST ?? '::'

const app = await build()
app.ready().then(async () => {
    try {
        await app.listen({ port, host })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})