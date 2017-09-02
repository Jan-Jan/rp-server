# RxJS Server

This is a simple RxJS 5 based server for node.
**No knowledge of RxJS is needed**
It uses a functional approach to be as simple as possible,
while including basic security best practices.

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


## Middleware

All the magic lies in the middleware.
For a more complete system, it would look like this.

```javascript
const httpHandlers = require('rxjs-server').httpHandlers
const { logger, tokenAuth, authRequired } = httpHandlers

const authSettings = { /* all your secrets */ }

const middleware = ({ http$ }) => ({
  http$: http$
    .do(logger)
    .do(tokenAuth(authSettings))
    .route(publicRoutes)
    .do(authRequired)
    .route(privateRoutes),
})
```

**NOTE: `tokenAuth` and `authRequired` have not been written yet.**

The `http$` is a RxJS Subject stream.
It already has the operators `map` and `do` added.

We defined the `route` operator.
It takes an array of route definitions, or just a single one.
A route definition is of the shape:

```javascript
{
  url: string,
  handler: function,
}
```

### Route handler

A route handler is supposed to be a pure function.
It gets passed the `req` variable.
It can return a null, undefined, string, a promise, or an object of the shape

```
{
  statusCode: number || undefined,
  body: string || promise || object,
}
```

If you return a null or undefined, then req will continue to be checked against later routes.
Whereas, if you respond with anything else, the request will not be checked against any further routes.

Examples can be found [here](example/otherRoutes.js)

*Later we will add the ability to handle streams too.*

## Future

* [ ] npm run *
* [ ] streams support
* [ ] httpHandlers: tokenAuth && authRequired
* [ ] tests
* [ ] websocket support
* [ ] typescript
