const Subject = require('./Subject')

const _next = ({ req, res, op }) => {
  console.log('op =', op)
  console.log('sending hello')
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')
}
/*
const _error =
const _done =
const _exit =
*/

function makeHttpEffect() {
  const requests$ = new Subject();
  return {
    writeEffect: function (model$) {
      model$.subscribe(_next)
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
}
