'use strict'

/**
 * Starts the server at the given port
 */
import express from 'express'
import bodyParser from 'body-parser'
import { getLinkPreview } from 'link-preview-js'
import { PreviewData } from './previewDataType'

const cors = require('cors')
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/link-preview', (req, res) => {
  if (Array.isArray(req.query.links)) {
    const linkPromises: Promise<PreviewData>[] = (req.query.links as string[]).map(link => {
      return getLinkPreview(link)
    })

    Promise.all(linkPromises)
    .then(data => {
      res.send(data)
    })
  } else {
    res.send([])
  }
})

app.listen(3006, () => {
  console.log(`Example API accessible on port 3006`)
})