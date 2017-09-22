const queryString = require('query-string')
const parser = require('body-parser').json()

async function parse({ req, res }) {
  const query = queryString.parse(queryString.extract(req.url))
  const body = await new Promise((resolve, reject) => {
    parser(req, null, (err) => {
      if (err) reject(err)
      return resolve(req.body)
    })
  })
  const { url, method } = req
  return { query, body, url, method, res }
}

module.exports = {
  parse
}
