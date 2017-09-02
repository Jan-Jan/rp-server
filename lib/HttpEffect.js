const Subject = require('./Subject')

const _contentType = op => {
  if (typeof op === 'string' || typeof op.body === 'string') return 'text/plain'
  // TODO: Check against otehr content types
  return 'text/plain'
}

const _writeRes = (res, statusCode, body) => {
  res.writeHead(statusCode, { 'Content-Type': _contentType(body) })
  res.end(body)
}

const _next = ({ res, op }) => {
  console.log('op =', op)
  const statusCode = op.statusCode || (op.error ? 500 : 200)
  const body = op.error || op.body || op || 'nothing happened'

  // TODO: handles streams
  if (Promise.resolve(body) == body) {
    body
      .then(bd => _writeRes(res, statusCode, bd))
      .catch(err => _writeRes(res, err.statusCode || 500, err.message))
  } else {
    _writeRes(res, statusCode, body)
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
