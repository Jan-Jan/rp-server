const tryCatch = predicate =>
  async function (data) {
    try {
      return await predicate(data)
    }
    catch (error) {
      return Object.assign({}, data, { op: { body: { error }, statusCode: error.statusCode || 500 }})
    }
  }

module.exports = {
  tryCatch
}
