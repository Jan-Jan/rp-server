const { parse } = require('../lib')
const logger = require('./logger')
const helloWordRoute = require('./hello-world-route')
const otherRoutes = require('./other-routes')

module.exports = (db, queue) => ({ http$, command$, request$  }) => ({
  http$: http$
    .do(logger)
    .catchMap(parse)
    .static(__dirname + '/public') // very BETA
    .route(helloWordRoute)
    .route(otherRoutes),
  command$: command$
    .do(({ data }) => console.log('command$: data =', data))
    //.catchMap(auth)
    //.route(commandRoutes)
    ,
  request$: request$,
})
