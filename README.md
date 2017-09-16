# rxserver

This is a simple tiny http server for node.
It uses a functional/reactive approach to be as simple as possible.

This server has the absolute minimal unique API,
so that it is [easy to use for beginners](#background) (no knowledge of rxjs required),
(without needing to learn anything complex framework),
while, advanced users can call on the full power of rxjs to adapt the system to their needs.

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
const middleware = ({ http$ }) => ({
  http$: http$
    .do(logger)
    .switchAssign(parse)
    .route(routes),
})

const { httpServerCallback } = createServerCallbacks(middleware)
```

The `http$` is a RxJS Subject stream, i.e., an observable.
It already has the operators `map` and `do` attached.

The `route` and `switchAssign` operators are unique to rxserver.

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

## Operator: switchAssign

You can think of the operator `switchAssign` as a combination of the
standard operator `switchMap` with `Object.assign`.

Most node.js servers, e.g., `express` or `hapi`, works by modifying the `req` object.
While, `rxserver` can be used that way using `do`, this is not a very functional and clean style.
Instead the suggested way is to use `switchAssign` that adds the object you return to the stream `http$`.

E.g., `http$` starts with the object `{ req, res }`.
`http$.switchAssign(() => ({ foo: 'bar' }))` will modify that object to `{ req, res, foo }`.

You can use `switchAssign` to add parsing middleware, e.g:

```javascript
const queryString = require('query-string')
const parser = require('body-parser').json()

async function parse({ req, res }) {
  const body = await new Promise((resolve, reject) => {
    parser(req, res, (err) => {
      if (err) reject(err)
      return resolve(req.body)
    })
  })
  return { body }
}

const middleware = ({ http$ }) => ({
  http$: http$
    .switchAssign(parse)
})
```

or more simply

```javascript
const parse = require('rxserver').parse

const middleware = ({ http$ }) => ({
  http$: http$
    .switchAssign(parse)
})
```

## TODO (pull requests welcome)

* [ ] serve static files
* [ ] schema verification (optional)
* [ ] httpHandlers: tokenAuth && route.role (optional)
* [ ] improve security
* [ ] `npm run example`, etc *
* [ ] tests: jest
* [ ] circleci
* [ ] websocket support
* [ ] typescript
* [ ] business rules example
