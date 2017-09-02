module.exports = (main, drivers) => {
  const sources = Object.keys(drivers)
    .reduce((src, key) =>
      Object.assign(src, { [key]: drivers[key].readEffect }), {})

  const sinks = main(sources)
  Object.keys(drivers).forEach(key => {
    drivers[key].writeEffect(sinks[key])
  })
}
