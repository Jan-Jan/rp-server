'use strict'

const rxjsServer = require('./lib')
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


const middleware = ({ http$ /*, wss$ */ }) => ({
  http$: http$
    .do(e => console.log('request to', e.req.url)),
})

const {
  httpServerCallback,
  // wssServerCallback,
} = createServerCallbacks(middleware)


const http = require('http')
const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  });
