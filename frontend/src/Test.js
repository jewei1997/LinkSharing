// using CommonJS modules
var Base64 = require('js-base64').Base64
var fetch = require('isomorphic-unfetch')

const options = {
  headers: {
    Authorization: 'admin:123passwd123'
  }
}

fetch('http://127.0.0.1:8000/linklist/', options)
  .then( r => r.json() )
  .then( r => console.log(r) );

// fetch('http://127.0.0.1:8000/linklist/20/', options)
//   .then( r => r.json() )
//   .then( r => console.log(r) );

const data = {
  title: 'My new test list',
  date_created: '2020-06-15T06:00:00Z',
}

// POST request to add a link to 
// fetch('http://127.0.0.1:8000/linklist/20/', {
//   headers: {
//     Authorization: `Basic ${Base64.encode(`admin:123passwd123`)}`,
//     'Content-Type': 'application/json'
//   },
//   method: 'POST',
//   body: JSON.stringify(data)
// })
//   .then((r) => {
//     console.log(r.status, r.statusMessage)
//     return r.json()
//   })
//   .then((r) => console.log(r))


fetch('http://127.0.0.1:8000/linklist/', {
  headers: {
    Authorization: `Basic ${Base64.encode(`admin:123passwd123`)}`,
    'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify(data)
})
  .then((r) => {
    console.log(r.status, r.statusMessage)
    return r.json()
  })
  .then((r) => console.log(r))



// const data = {
  // pk: 7
// }
// 
// fetch('http://127.0.0.1:8000/linklist/20', {
  // headers: {
    // Authorization: `Basic ${Base64.encode(`admin:123passwd123`)}`,
    // "Content-Type": "application/json"
  // },
  // method: 'DELETE',
  // body: JSON.stringify(data)
// })
