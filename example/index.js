'use strict'

const http = require('http')
const { URL } = require('url')
const rxjsServer = require('../lib')
const {
  createServerCallbacks,
} = rxjsServer
const logger = require('pino-http')()
const queryString = require('query-string')

const helloWordRoute = require('./hello-world-route')
const otherRoutes = require('./other-routes')
const parser = require('body-parser').json()

const middleware = ({ http$ /*, ws$ */ }) => ({
  http$: http$
    .do(({ req, res }) => logger(req, res))
    .switchAssign(async function({ req, res }) {
      const query = queryString.parse(queryString.extract(req.url))
      const body = await new Promise((resolve, reject) => {
        parser(req, res, (err) => {
          if (err) reject(err)
          return resolve(req.body)
        })
      })
      return { query, body }
    })
    .route(helloWordRoute)
    .route(otherRoutes)
})

const {
  httpServerCallback,
  // wsServerCallback,
} = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
