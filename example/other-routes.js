const http = require('http')
const fs = require('fs')

module.exports = [
  {
    url: '/',
    method: 'POST',
    handler: ({ req }) => ({
      statusCode: 201,
      body: 'it was made so',
    })
  }, {
    url: '/name/:name',
    handler: ({ req }) => ({
      msg: `Hello ${req.params.name}`,
    })
  }, {
    url: 'user',
    method: 'POST',
    handler: ({ body }) => Promise.resolve({ statusCode: 201, body }),
  }, {
    url: 'stream',
    handler: data => fs.createReadStream(__dirname + '/index.js'),
  }, {
    url: 'search',
    handler: async function({ query }) {
      return await Promise.resolve({
        statusCode: 200,
        body: `async response: query = ${JSON.stringify(query)}`
      })
    },
  }, {
    url: '*',
    handler: ({ req }) => {
      const err = new Error('route not found')
      err.statusCode = 404
      throw err
    },
  }
]
