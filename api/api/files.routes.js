import {config} from '../config.js'

export default async function apiRoutes(api) {
  api.get('/files', async (req, res) => {
    const files = await api.filesService.fetchFiles()
    res.send({files})
  })

  api.get('/download-archive', async (req, res) => {
    const sFileIds = req.query.files
    if (!sFileIds) {
      return res.code(500).send({error: 'No file ID provided'})
    }
    const fileIds = sFileIds.split(',').map(sId => Number(sId))

    try {
      const buffer = await api.filesService.zipArchive(fileIds)

      res.header('Content-Disposition', `attachment; filename="files.zip"`)
      res.header('Content-Type', 'application/zip')

      return res.send(buffer)
    } catch (err) {
      res.code(500).send({error: 'File not found or cannot be read'})
    }
  })

  api.post('/upload-archive', async (req, res) => {
    let buffer = req.body['file']
    if (buffer?.length > 0)
      await api.filesService.unzipArchive(buffer)
    res.send({})
  })
}
