const Subject = require('rxjs/Subject').Subject
Subject.prototype.map = require('rxjs/operator/map').map

const _handle = (data, project) => {
  try {
    return Object.assign(data, { op: project(data.req) })
  } catch(e) {
    e.res = data.res
    throw e
  }
}

Subject.prototype.handle = function(project) {
  return this.map(data => data.op
    ? data
    : _handle(data, project)
  )
}

module.exports = Subject
