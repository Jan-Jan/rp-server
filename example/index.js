'use strict'

const http = require('http')
const rxjsServer = require('../lib')
const {
  createServerCallbacks,
  route,
  httpHandlers: {
    notFound,
    // tokenAuth,
    // cookieAuth,
    // oauth2Auth,
    // authRequired,
  }
} = rxjsServer

const helloWordRoute = require('./helloWorldRoute')
const otherRoutes = require('./otherRoutes')

const middleware = ({ http$ }) => ({
  http$: http$
    .handle(({ method, url }) => console.log(`${method}:${url}`))
    // .handle(tokenAuth(authSettings))
    .handle(route(helloWordRoute))
    .handle(route(otherRoutes))
    // .handle(authRequired)
    // .handle(route(privateRoutes))
    .handle(notFound)
})

const {
  httpServerCallback,
} = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
