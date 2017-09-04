const _initEffect = (key, defaults, custom = {}) => {
  const cstm = custom[key] || {}
  const { Effect, next, error, complete } = Object.assign({}, defaults[key], cstm)
  return { [key]: new Effect(next, error, complete) }
}

const reduceEffects = (ffcts, key, defaults, custom) =>
  Object.assign(ffcts, _initEffect(key, defaults, custom))

module.exports = {
  reduceEffects,
  _initEffect,
}
