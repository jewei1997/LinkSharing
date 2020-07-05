'use strict'

/**
 * Starts the server at the given port
 */
import express from 'express'
import bodyParser from 'body-parser'
import {getLinkPreview} from 'link-preview-js';
const cors = require('cors')
const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/link-preview', (req, res) => {

  console.log("request received for req = ", req)

  //@ts-ignore
  const linkPromises = req.query.links.map(link => {
    return getLinkPreview(link)
  })

  Promise.all(linkPromises)
  .then(data => {
    console.log("resulting data to return = ", data)
    res.send(data)
  })
})

app.listen(3006, () => {
  console.log(`Example API accessible on port 3006`)
})