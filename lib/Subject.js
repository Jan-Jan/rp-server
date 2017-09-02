const Subject = require('rxjs/Subject').Subject
Subject.prototype.handle = require('./handle')

module.exports = Subject
