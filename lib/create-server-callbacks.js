const run = require('./run')
const main = require('./main')
const HttpEffect = require('./http-effect').HttpEffect
const reduceEffects = require('./effects').reduceEffects

const createConfig = () => ([
  // streamTypes
  ['http$'],
  // orgEffects
  {
    http$: HttpEffect,
    // ws$: WsEffect,
  },
])


module.exports = (middleware = () => ({}), overrideNext = {}, overrideEffects = {}) => {

  const [streamTypes, orgEffects] = createConfig()

  const effects = streamTypes
    .reduce((ffcts, key) => reduceEffects(ffcts, key, orgEffects, overrideNext, overrideEffects), {})

  const drivers = streamTypes
    .reduce((drvs, key) =>
      Object.assign(drvs, { [key]: effects[key] }), {})

  run(main(middleware), drivers)

  const callbacks = streamTypes
    .reduce((cbs, key) =>
      Object.assign(cbs, { [key.slice(0, -1)+'ServerCallback']: effects[key].serverCallback.bind(effects[key]) }), {})

  return callbacks
}
