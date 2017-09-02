const Subject = require('rxjs/Subject').Subject
Subject.prototype.map = require('rxjs/operator/map').map
const route = require('./route').route

const _handle = (data, project) => {
  try {
    return Object.assign(data, { op: project(data.req) })
  } catch({ message: error, statusCode }) {
    return Object.assign(data, { op: { error, statusCode }})
  }
}

Subject.prototype.route = function(routeDefinitions) {
  return this.map(data => data.op
    ? data
    : _handle(data, route(routeDefinitions))
  )
}

module.exports = Subject
