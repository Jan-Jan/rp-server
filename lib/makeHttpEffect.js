const Subject = require('./Subject')

function makeHttpEffect() {
  const requests$ = new Subject();
  return {
    writeEffect: function (model$) {
      model$.subscribe(e => {
        console.log('sending hello')
        e.res.writeHead(200, { 'Content-Type': 'text/plain' })
        e.res.end('Hello World\n')
      })
      return requests$
    },
    serverCallback: (req, res) => {
      requests$.next({ req: req, res: res })
    },
    readEffect: requests$
  }
}

module.exports = makeHttpEffect
