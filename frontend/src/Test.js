// using CommonJS modules
var Base64 = require('js-base64').Base64
var fetch = require('isomorphic-unfetch')

const options = {
  headers: {
    Authorization: 'admin:123passwd123'
  }
}

// fetch('http://127.0.0.1:8000/linklist/', options)
//   .then( r => r.json() )
//   .then( r => console.log(r) );

// fetch('http://127.0.0.1:8000/linklist/20/', options)
//   .then( r => r.json() )
//   .then( r => console.log(r) );

// const data = {
//   title: 'My title3',
//   link: 'https://www.facebook.com',
//   date_added: '2020-06-15T06:00:00Z',
//   linklist: 20
// }

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


const data = {
  pk: 1
}

fetch('http://127.0.0.1:8000/linklist/20', {
  headers: {
    Authorization: `Basic ${Base64.encode(`admin:123passwd123`)}`
  },
  method: 'DELETE',
  body: JSON.stringify(data)
})
