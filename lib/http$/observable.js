const Observable = require('rxjs/Observable').Observable
require('rxjs/add/operator/map')
require('rxjs/add/operator/do')
require('rxjs/add/operator/switchMap')
require('rxjs/add/operator/catch')

const route = require('./route').route
const staticRouting = require('./static-routing').staticRouting
const tryCatch = require('./try-catch').tryCatch
const tryCatchOp = require('./try-catch-op').tryCatchOp

const _handleError = (data, { message: error, statusCode = 500 }) =>
  Object.assign({}, data, { op: { body: { error }, statusCode }})

const optionalExecution = (predicate, trying) =>
  async function (data) {
    return data.op
      ? data
      : await trying(predicate)(data)
  }

Observable.prototype.catchMap = function(predicate, trying = tryCatch) {
  return this.switchMap(optionalExecution(predicate, trying))
}

Observable.prototype.route = function(routeDefinitions) {
  return this.catchMap(route(routeDefinitions), tryCatchOp)
}

Observable.prototype.static = function(root, options) {
  return this.catchMap(staticRouting(root, options), tryCatchOp)
}



module.exports = {
  _handleError,
  Observable,
}
