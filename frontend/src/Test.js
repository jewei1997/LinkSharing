// using CommonJS modules
var fetch = require('isomorphic-unfetch')

const options = {
    headers: {
        "Authorization": "admin:123passwd123"
    }
}

// fetch('http://127.0.0.1:8000/linklist/', options)
//   .then( r => r.json() )
//   .then( r => console.log(r) );

fetch('http://127.0.0.1:8000/linklist/20/', options)
  .then( r => r.json() )
  .then( r => console.log(r) );