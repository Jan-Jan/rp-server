const Subject = require('rxjs/Subject').Subject
Subject.prototype.map = require('rxjs/operator/map').map

Subject.prototype.handle = function(project) {
  return this.map(data => data.op
    ? data
    : Object.assign(data, { op: project(data.req) })
  )
}

module.exports = Subject
