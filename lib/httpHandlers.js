module.exports = {
  notFound: req => {
    const err = new Error('route not found')
    err.statusCode = 404
    throw err
  },
}
