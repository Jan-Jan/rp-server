const queryString = require('query-string')
const parser = require('body-parser').json()

async function parse({ req }) {
  const query = queryString.parse(queryString.extract(req.url))
  const body = await new Promise((resolve, reject) => {
    parser(req, null, (err) => {
      if (err) reject(err)
      return resolve(req.body)
    })
  })
  const { url, method } = req
  return { query, body, url, method }
}

module.exports = {
  parse
}
