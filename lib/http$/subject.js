const Subject = require('rxjs/Subject').Subject
require('rxjs/add/operator/map')
require('rxjs/add/operator/do')
require('rxjs/add/operator/switchMap')

const route = require('./route').route

const _handleRoute = (data, project) => {
  try {
    const { res, op, ...rest } = data
    return Object.assign({}, data, { op: project(rest) })
  } catch({ message: error, statusCode }) {
    return Object.assign({}, data, { op: { body: { error }, statusCode }})
  }
}

Subject.prototype.route = function(routeDefinitions) {
  return this.map(data => data.op
    ? data
    : _handleRoute(data, route(routeDefinitions))
  )
}

Subject.prototype.switchAssign = function(asyncFunction) {
  return this.switchMap(async function(obj) {
      try {
        const res = await asyncFunction(obj)
        return Object.assign({}, obj, res)
      } catch({ message: error, statusCode = 500 }) {
        return Object.assign({}, obj, { op: { body: { error }, statusCode }})
      }
  })
}

module.exports = Subject
