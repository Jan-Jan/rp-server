const queryString = require('query-string')
const parser = require('body-parser').json()

module.exports = async function parse({ req, res }) {
  const query = queryString.parse(queryString.extract(req.url))
  const body = await new Promise((resolve, reject) => {
    parser(req, res, (err) => {
      if (err) reject(err)
      return resolve(req.body)
    })
  })
  return { query, body }
}
