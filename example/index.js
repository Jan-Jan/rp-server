'use strict'

const http = require('http')
const rxserver = require('../lib')
const {
  createServerCallbacks,
  httpHelpers: {
    parse,
  },
} = rxserver

const logger = require('./logger')
const helloWordRoute = require('./hello-world-route')
const otherRoutes = require('./other-routes')

const middleware = ({ http$ /*, ws$ */ }) => ({
  http$: http$
    .do(logger)
    .switchAssign(parse)
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
