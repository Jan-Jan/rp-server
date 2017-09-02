'use strict'

const http = require('http')
const rxjsServer = require('../lib')
const {
  createServerCallbacks,
  httpHandlers: {
    logger,
    // tokenAuth,
    // cookieAuth,
    // oauth2Auth,
    // authRequired,
  },
} = rxjsServer

const helloWordRoute = require('./helloWorldRoute')
const otherRoutes = require('./otherRoutes')

const middleware = ({ http$ /*, ws$ */ }) => ({
  http$: http$
    .do(logger)
    // .map(tokenAuth(authSettings))
    .route(helloWordRoute)
    .route(otherRoutes)
    // .map(authRequired)
    // .route(privateRoutes)
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
