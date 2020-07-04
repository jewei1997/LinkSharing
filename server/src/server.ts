'use strict'

/**
 * Starts the server at the given port
 */
import express from 'express'
import bodyParser from 'body-parser'
import {getLinkPreview} from 'link-preview-js';
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/object', (req, res) => {

  console.log(req.query)

  getLinkPreview("https://tesla.com")
  .then((data) => console.log(data));
  res.send({
    data: 'object'
  })
})

app.listen(3006, () => {
  console.log(`Example API accessible on port 3006`)
})