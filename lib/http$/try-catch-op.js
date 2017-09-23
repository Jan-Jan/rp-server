const tryCatchOp = predicate =>
  async function ({ res, ...data }) {
    try {
      const op = await predicate(data)
      return Object.assign({}, data, { res, op })
    }
    catch (error) {
      return Object.assign({}, data, { res, op: { body: { error }, statusCode: error.statusCode || 500 }})
    }
  }

module.exports = {
  tryCatchOp
}
