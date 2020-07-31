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
  const myArray : string[] | undefined = Array.isArray(req.query.links) ? 
    req.query.links as string[] : 
    typeof req.query.links === "string" ? 
      [req.query.links as string] : 
      undefined
  if (myArray) {
    const linkPromises: Promise<PreviewData>[] = myArray.map(link => {
      return getLinkPreview(link)
    })

    Promise.all(linkPromises)
    .then(data => {
      res.send(data)
    })
  } else {
    res.status(400).send([])
  }
})

app.listen(3006, () => {
  console.log(`Example API accessible on port 3006`)
})
