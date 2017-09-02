const Subject = require('rxjs/Subject').Subject;

function makeHttpEffect() {
  const requests_ = new Subject();
  return {
    writeEffect: function (model_) {
      model_.subscribe(e => {
        console.log('sending hello')
        e.res.writeHead(200, { 'Content-Type': 'text/plain' })
        e.res.end('Hello World\n')
      })
      return requests_
    },
    serverCallback: (req, res) => {
      requests_.next({ req: req, res: res })
    },
    readEffect: requests_
  }
}

module.exports = makeHttpEffect
