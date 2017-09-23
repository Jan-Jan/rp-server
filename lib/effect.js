const Subject = require('rxjs/Subject').Subject

const Effect = (Observable) =>
  class EffectClass {
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
    serverCallback (...args) {
      if (args[0].hasOwnProperty('_readableState')) {
        // ie, this is a http$
        this.requests$.next({ req: args[0], res: args[1] })
      }
      else {
        // ie, this is a ws$
        this.requests$.next(args)
      }
    }
    get readEffect() {
      return this.requests$.asObservable()
    }
  }

module.exports = { Effect }
