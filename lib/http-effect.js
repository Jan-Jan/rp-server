const Subject = require('./http-subject')

const _contentType = op => {

  if (typeof op === 'string' || typeof op.body === 'string') return 'text/plain'
  if (op.hasOwnProperty('_readableState')) return 'application/octet-stream'
  // TODO: Check against otehr content types
  return 'application/json'
}

const _writeRes = (res, statusCode, body, cntntTp) => {

  const contentType = cntntTp || _contentType(body)
  res.writeHead(statusCode, { 'Content-Type': contentType })
  if (contentType === 'application/octet-stream') {
    body.pipe(res)
  } else {
    res.end(typeof body === 'string' ? body : JSON.stringify(body))
  }
}

const _next = ({ res, op }) => {

  const statusCode = op
    ? op.statusCode || (op.body && op.body.error ? 500 : 200)
    : 404
  const body = op
    ? op.body || op
    : { error: 'url not found' }
  const contentType = op.contentType

  if (Promise.resolve(body) == body) {
    body
      .then(bod => _writeRes(res, statusCode, bod, contentType))
      .catch(err => _writeRes(res, err.statusCode || 500, err.message))
  } else {
    _writeRes(res, statusCode, body, contentType)
  }
}

class HttpEffect {
  constructor (next = _next) {
    this.requests$ = new Subject()
    this.next = next
  }
  writeEffect (model$) {
    model$.subscribe(this.next)

    return this.requests$
  }
  serverCallback (req, res) {
    this.requests$.next({ req, res })
  }
  get readEffect() {
    return this.requests$
  }
}

module.exports = {
  HttpEffect,
  _next,
}
