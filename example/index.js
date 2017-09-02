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
require('rxjs/add/operator/do')

const helloWordRoute = require('./helloWorldRoute')
// const otherRoutes = require('./otherRoutes')

const middleware = ({ http$ /*, wss$ */ }) => ({
  http$: http$
    .handle(({ url }) => console.log('url =', url))
    .handle(({ method }) => console.log('method =', method))
    .handle(route(helloWordRoute))
    .handle(notFound)
/*
    // .handle(tokenAuth(authSettings))
    .handle(route(otherRoutes))
    // .handle(authRequired)
    // .handle(route(privateRoutes))
    .handle(notFound),
*/
})

const {
  httpServerCallback,
  // wssServerCallback,
} = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  });
