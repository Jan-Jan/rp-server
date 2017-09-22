# rxserver

This is a simple tiny http server for node.
It uses a functional/reactive approach to be as simple as possible.

This server has the absolute minimal unique API,
so that it is easy to use for beginners
(i.e, without needing to learn a complex framework).
While, advanced users can call on the full power of rxjs to adapt the system to their needs.

This also means that testing should be very easy,
as the majority of your code should be simple functions that only include business logic.

This library was inspired by
[Building REST APIs with Observables](https://glebbahmutov.com/blog/node-server-with-rx-and-cycle/)
and
[Node server with Rx and Cycle.js](https://glebbahmutov.com/blog/node-server-with-rx-and-cycle/).


## Installation

```
npm install --save rxserver
```

## Getting started

Creating your first server is as easy as

```javascript
const createServerCallbacks = require('rxserver').createServerCallbacks

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

## Adding middleware

All the magic lies in the middleware.


```javascript
const { parse, tryCatch } = rxserver

const middleware = ({ http$ }) => ({
  http$: http$
    .do(logger)
    .catchMap(parse)
    .static(__dirname + '/public')
    .route(routes),
})

const { httpServerCallback } = createServerCallbacks(middleware)
```

The `http$` is a RxJS Subject stream, i.e., an observable.
It already has the operators `map`, `switchMap` and `do` attached.

The `parse` function asynchronously (hence the `switchMap` operator) converts `{ req, res }` into `{ url, method, body, res }`. It is wrapped in `tryCatch`

The `switchCatch`, `route` and `static` operators are unique to rxserver.

### Operator: switchCatch

`catchMap` is the standard `switchMap(predicate)` changed to `switchMap(tryCatch(predicate))`.
Where the `tryCatch` wraps your predicate function in a try/catch block, because streams do not handle thrown errors at all. I.e., `.catchMap(parse)` is exactly the same as `switchMap(tryCatch(parse))`.

### Operator: route

A route can be defined using simple functions, promises, async/await, or streams.
E.g.,

```javascript
const routes = [
  {
    url: '/name/:name',
    handler: ({ params }) => `Hello ${params.name}`,
  },
  {
    url: '/user',
    method: 'POST',
    handler: ({ body }) => Promise.resolve({ statusCode: 201, body }),
  },
  {
    url: '/search',
    handler: async function({ query }) {
      return await Promise.resolve({
        statusCode: 200,
        body: `async response: query = ${JSON.stringify(query)}`
      })
    },
  },
  {
    url: 'stream',
    handler: data => fs.createReadStream(__dirname + '/index.js'),  
  }
]

const middleware = ({ http$ }) => ({
  http$: http$
    .route(routes)
})
```

A route handler is supposed to be a simple function, e.g., see examples above.
It can return a null, undefined, string, a promise, or an object of the shape

```
{
  statusCode: number || undefined,
  body: string || promise || object,
}
```

If you return a null or undefined, then req will continue to be checked against later routes.
Whereas, if you respond with anything else, the request will not be checked against any further routes.

Examples can be found [here](example/other-routes.js)

## Operator: static [BETA]

Static servers the files from the directory passed to it:

```javascript

const middleware = ({ http$ }) => ({
  http$: http$
    .route(routes)
})
```

## TODO (pull requests welcome)

* [ ] server side rendering
* [ ] schema verification (optional)
* [ ] authentication middleware
* [ ] `helmet` security functionality
* [ ] `npm run example`, etc *
* [ ] tests: jest
* [ ] circleci
* [ ] websocket support
* [ ] typescript && tsickle in example
* [ ] business rules example
