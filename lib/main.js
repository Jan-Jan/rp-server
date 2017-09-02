module.exports = middleware => sources => {
  const middle = middleware(sources)
  return Object.assign({}, sources, middle)
}
