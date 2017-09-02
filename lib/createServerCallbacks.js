const makeHttpEffect = require('./makeHttpEffect').makeHttpEffect
const run = require('./run')
const main = require('./main')

module.exports = (middleware = () => ({})) => {
  const effects = {
    http$: makeHttpEffect(),
    // wss$: makeWssEffect(),
  }

  const drivers = Object.keys(effects)
    .reduce((drvs, key) =>
      Object.assign(drvs, { [key]: effects[key] }), {})

  run(main(middleware), drivers)

  const callbacks = Object.keys(effects)
    .reduce((cbs, key) =>
      Object.assign(cbs, { [key.slice(0, -1)+'ServerCallback']: effects[key].serverCallback }), {})

  return callbacks
}
