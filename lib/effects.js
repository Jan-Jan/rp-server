const _initEffect = (key, orgEffects, overrideNext = {}, overrideEffects = {}) => ({
  [key]: overrideEffects[key]
    ? new overrideEffects[key](overrideNext[key])
    : new orgEffects[key](overrideNext[key]),
})

const reduceEffects = (ffcts, key, orgEffects, overrideNext, overrideEffects) =>
  Object.assign(ffcts, _initEffect(key, orgEffects, overrideNext, overrideEffects))

module.exports = {
  reduceEffects,
  _initEffect,
}
