'use strict'

const http = require('http')
const rxjsServer = require('../lib')
const {
  createServerCallbacks,
/*
  route,
  httpHandlers: {
    notFound,
    // tokenAuth,
    // cookieAuth,
    // oauth2Auth,
    // authRequired,
  }
*/
} = rxjsServer
require('rxjs/add/operator/do')

/*
const helloWordRoute = require('./helloWordRoute')
const otherRoutes = require('./otherRoutes')
*/

const middleware = ({ http$ /*, wss$ */ }) => ({
  http$: http$
    .handle(({ url }) => console.log('url =', url))
    // .handle(req => 'WOOT')
    .handle(req => {
      const err = new Error('this is a problem')
      err.statusCode = 666
      throw err
    })
/*
    // .handle(tokenAuth(authSettings))
    .handle(route(helloWordRoute))
    .handle(route(otherRoutes))
    // .handle(authRequired)
    // .handle(route(privateRoutes))
    .handle(notFound),
*/
})

const {
  httpEffect,
  // wssServerCallback,
} = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpEffect.serverCallback.bind(httpEffect))
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  });
