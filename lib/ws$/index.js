const Observable = require('./observable').Observable

module.exports = {
  Effect: require('../effect').Effect(Observable),
  next: (...args) => console.log('ws$.next: args =', args ), // require('./next').next,
  error: error => console.log('ws$.error =', error), // require('./error').error,
  complete: () => console.log('ws$.complete'), // require('./complete').complete,
}
