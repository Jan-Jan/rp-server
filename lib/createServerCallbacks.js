const HttpEffect = require('./HttpEffect').HttpEffect
const run = require('./run')
const main = require('./main')

module.exports = (middleware = () => ({}), next = {}) => {
  const effects = {
    http$: new HttpEffect(next.http$),
    // wss$: makeWssEffect(),
  }

  const drivers = Object.keys(effects)
    .reduce((drvs, key) =>
      Object.assign(drvs, { [key]: effects[key] }), {})

  run(main(middleware), drivers)

  const callbacks = Object.keys(effects)
    .reduce((cbs, key) =>
      Object.assign(cbs, { [key.slice(0, -1)+'ServerCallback']: effects[key].serverCallback.bind(effects[key]) }), {})

  return callbacks
}
