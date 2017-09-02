# RxJS Server

This library was inspired by
[Building REST APIs with Observables](https://glebbahmutov.com/blog/node-server-with-rx-and-cycle/)
and
[Node server with Rx and Cycle.js](https://glebbahmutov.com/blog/node-server-with-rx-and-cycle/).


## Installation

```
npm install --save rxjs-server
```

## Getting started

Creating your first server is as easy as

```javascript
const createServerCallbacks = require('rxjs-server').createServerCallbacks

const routes = [
  {
    url: '/',
    handler: () => 'Hello World',
  }, {
    url: '*',
    handler: () => {
      const err = new Error('route not found')
      err.statusCode = 404
      throw err
    },
  },
]

const middleware = ({ http$ }) => ({
  http$: http$.route(routes),
})

const { httpServerCallback } = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
```

All the magic lies in the middleware.
For a more complete system, it would look like this.

```javascript
const httpHandlers = require('rxjs-server').httpHandlers
const { logger, tokenAuth, authRequired } = httpHandlers

const authSettings = { /* all your secrets */ }

const middleware = ({ http$ }) => ({
  http$: http$
    .do(logger())
    .map(tokenAuth(authSettings))
    .route(publicRoutes)
    .map(authRequired)
    .route(privateRoutes),
})
```
