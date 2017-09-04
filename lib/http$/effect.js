const Subject = require('./subject')

class Effect {
  constructor (next, error = () => {}, complete = () => {}) {
    this.requests$ = new Subject()
    this.next = next
    this.error = error
    this.complete = complete
  }
  writeEffect (model$) {
    model$.subscribe(this.next, this.error, this.complete)

    return this.requests$
  }
  serverCallback (req, res) {
    this.requests$.next({ req, res })
  }
  get readEffect() {
    return this.requests$
  }
}

module.exports = { Effect }
