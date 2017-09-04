const run = require('./run')
const main = require('./main')
const HttpEffect = require('./http/effect').HttpEffect
const reduceEffects = require('./effect-utils').reduceEffects

const createConfig = () => ([
  // streamTypes
  ['http$'],
  // orgEffects
  {
    http$: HttpEffect,
    // ws$: WsEffect,
  },
])


module.exports = (middleware = () => ({}), custom = {}) => {

  const [streamTypes, defaultEffects] = createConfig()

  const effects = streamTypes
    .reduce((ffcts, key) => reduceEffects(ffcts, key, defaultEffects, custom), {})

  const drivers = streamTypes
    .reduce((drvs, key) =>
      Object.assign(drvs, { [key]: effects[key] }), {})

  run(main(middleware), drivers)

  const callbacks = streamTypes
    .reduce((cbs, key) =>
      Object.assign(cbs, { [key.slice(0, -1)+'ServerCallback']: effects[key].serverCallback.bind(effects[key]) }), {})

  return callbacks
}
