const Subject = require('./Subject')

const _next = ({ res, op }) => {
  console.log('op =', op)
  console.log('sending hello')
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')
}
const _error = err => {
  console.log('err =', err.message)
  const res = err.res
  res.writeHead(err.statusCode || 500, { 'Content-Type': 'text/plain' })
  res.end(err.message)
}

class HttpEffect {
  constructor () {
    this.requests$ = new Subject()
  }
  writeEffect (model$) {
    model$.subscribe(_next, _error)

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
  _error,
}
