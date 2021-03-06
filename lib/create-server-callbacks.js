const run = require('./run')
const main = require('./main')
const http$ = require('./http$')
const ws$ = require('./ws$')
const reduceEffects = require('./effect-utils').reduceEffects

const createServerCallbacks = (
  middleware = () => ({}),
  custom = {}
) => {

  const defaults = {
    http$,
    command$: ws$,
    query$: ws$,
  }

  const streamTypes = Object.keys(defaults)

  const effects = streamTypes
    .reduce((ffcts, key) => reduceEffects(ffcts, key, defaults, custom), {})

  const drivers = streamTypes
    .reduce((drvs, key) =>
      Object.assign(drvs, { [key]: effects[key] }), {})

  run(main(middleware), drivers)

  const callbacks = {
    httpServerCallback: effects.http$.serverCallback.bind(effects.http$),
    wsServerCallback: (io, options = {}) => socket => {

      if (options.setup) setup(io, socket)

      const commandCallback = effects.command$.serverCallback.bind(effects.command$)
      socket.on('command', data => commandCallback(io, socket, data))

      const queryCallback = effects.query$.serverCallback.bind(effects.query$)
      socket.on('query', data => queryCallback(io, socket, data))

      if (options.disconnect) socket.on('disconnect', disconnect)
    },
  }

  return callbacks
}

module.exports = {
  createServerCallbacks,
}
