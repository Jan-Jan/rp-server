const Subject = require('./Subject')

const _contentType = op => {
  if (typeof op === 'string' || typeof op.body === 'string') return 'text/plain'

  return 'text/plain'
}

const _next = ({ res, op }) => {
  console.log('op =', op)
  const statusCode = op.statusCode || (op.error ? 500 : 200)
  const body = op.error || op.body || op || 'nothing happened'

  // TODO: change 'Content-Type' according to content
  // TODO: handles streams
  // TODO: handle op being a Promise

  res.writeHead(statusCode, { 'Content-Type': _contentType(op) })
  res.end(body)
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
