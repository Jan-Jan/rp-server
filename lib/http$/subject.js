const Subject = require('rxjs/Subject').Subject
require('rxjs/add/operator/map')
require('rxjs/add/operator/do')
require('rxjs/add/operator/switchMap')

const route = require('./route').route
const static = require('./static').static
const tryCatch = require('./try-catch').tryCatch

const _handleError = (data, { message: error, statusCode = 500 }) =>
  Object.assign({}, data, { op: { body: { error }, statusCode }})

const _handleRoute = (data, project) => {
  try {
    const { res, op, ...rest } = data
    return Object.assign({}, data, { op: project(rest) })
  } catch(error) {
    return _handleError(data, error)
  }
}

async function _handleStatic (data, root, options) {
  try {
    const op = await static(data, root, options)
    return Object.assign({}, data, { op })
  } catch(error) {
    return _handleError(data, error)
  }
}

Subject.prototype.route = function(routeDefinitions) {
  return this.map(data => data.op
    ? data
    : _handleRoute(data, route(routeDefinitions))
  )
}

Subject.prototype.static = function(root, options) {
  return this.switchMap(data => data.op
    ? data
    : _handleStatic(data, root, options)
  )
}

Subject.prototype.catchMap = function(predicate) {
  return this.switchMap(data => data.op
    ? data
    : tryCatch(predicate)(data)
  )
}


module.exports = {
  _handleError,
  _handleRoute,
  Subject,
}
