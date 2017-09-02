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

```
const rxjsServer = require('rxjs-server')
const {
  createServerCallbacks,
  route,
  httpHandlers: {
    notFound,
  }
} = rxjsServer

const middleware = ({ http$ }) => ({
  http$: http$
    .handle(route({
      url: '/',
      handler: () => 'Hello World',
    }))
    .handle(notFound)
})

const { httpServerCallback } = createServerCallbacks(middleware)

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
```
