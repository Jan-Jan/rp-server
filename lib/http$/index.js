const Observable = require('./observable').Observable

module.exports = {
  Effect: require('../effect').Effect(Observable),
  next: require('./next').next,
  error: require('./error').error,
  complete: require('./complete').complete,
}
