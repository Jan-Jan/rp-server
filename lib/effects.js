const _initEffect = (key, effects, custom = {}) => {
  const cstm = custom[key] || {}
  const effect = typeof cstm.effect === 'function'
    ? cstm.effect
    : effects[key]
  return { [key]: new effect(cstm.next, cstm.error, cstm.complete) }
}

const reduceEffects = (ffcts, key, effects, custom) =>
  Object.assign(ffcts, _initEffect(key, effects, custom))

module.exports = {
  reduceEffects,
  _initEffect,
}
