const run = require('./run')
const main = require('./main')
const http$ = require('./http$')
const reduceEffects = require('./effect-utils').reduceEffects

const createServerCallbacks = (
  middleware = () => ({}),
  custom = {}
) => {

  const defaults = {
    http$,
    // ws$,
  }

  const streamTypes = Object.keys(defaults)

  const effects = streamTypes
    .reduce((ffcts, key) => reduceEffects(ffcts, key, defaults, custom), {})

  const drivers = streamTypes
    .reduce((drvs, key) =>
      Object.assign(drvs, { [key]: effects[key] }), {})

  run(main(middleware), drivers)

  const callbacks = streamTypes
    .reduce((cbs, key) =>
      Object.assign(cbs, { [key.slice(0, -1)+'ServerCallback']: effects[key].serverCallback.bind(effects[key]) }), {})

  return callbacks
}

module.exports = {
  createServerCallbacks,
}
