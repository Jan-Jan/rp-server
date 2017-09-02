# rp-server

This is a simple http server for node.
It uses a functional/reactive approach to be as simple as possible,
while including basic security best practices.

This is a simple RxJS 5 based server for node.
**No knowledge of RxJS is needed**
It uses a functional approach to be as simple as possible,
while including basic security best practices.

This library was inspired by
[Building REST APIs with Observables](https://glebbahmutov.com/blog/node-server-with-rx-and-cycle/)
and
[Node server with Rx and Cycle.js](https://glebbahmutov.com/blog/node-server-with-rx-and-cycle/).

## Background

I wrote this server, because I wanted to be able to define a route using simple functions or promises.
E.g.,

```javascript
{
  url: '/',
  handler: () => 'Hello World',
}
```

or

```javascript
{
  url: '/name/:name',
  handler: req => `Hello ${req.params.name}`,
}
```

or

```javascript
{
  url: '/user',
  method: 'POST',
  handler: req => Promise.resolve({ statusCode: 201, body: 'user created' }),
}
```

or

```javascript
{
  url: '/arb',
  handler: async function arb(req) {
    return await Promise.resolve('async/await magic'),
  },
}
```


## Installation

```
npm install --save rp-server
```

## Getting started

Creating your first server is as easy as

```javascript
const createServerCallbacks = require('rp-server').createServerCallbacks

const { httpServerCallback } = createServerCallbacks()

const hostname = '127.0.0.1'
const port = 1337

http.createServer(httpServerCallback)
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
```

Because we don't have any routes setup, a `curl http://127.0.0.1:1337/` will respond with

```json
{"error":"url not found"}
```

## Middleware

All the magic lies in the middleware.
To add some simple routing we can

```javascript
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
```

<<<<<<< HEAD

## Middleware

All the magic lies in the middleware.
For a more complete system, it would look like this.
=======
For a more complete system, it would look like this:
>>>>>>> dev

```javascript
const httpHandlers = require('rp-server').httpHandlers
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
<<<<<<< HEAD
A route definition is of the shape:

```javascript
{
  url: string,
  handler: function,
}
```

### Route handler

A route handler is supposed to be a pure function.
=======

### Route handler

A route handler is supposed to be a simple function, e.g., see examples above.
>>>>>>> dev
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

## TODO (pull requests welcome)

* [ ] npm run *
* [ ] streams support
* [ ] httpHandlers: tokenAuth && authRequired
* [ ] tests
* [ ] websocket support
* [ ] typescript
