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
const _done = requests$ => () => {
  requests$.dispose()
  console.log('requests$ disposed')
}
const _exit = _done

function makeHttpEffect() {
  const requests$ = new Subject();

  return {
    writeEffect: function (model$) {
      model$.subscribe(_next, _error, _done(requests$))

      return requests$
    },
    serverCallback: (req, res) => {
      requests$.next({ req, res })
    },
    readEffect: requests$
  }
}

module.exports = {
  makeHttpEffect,
  _next,
  _error,
  _done,
}
