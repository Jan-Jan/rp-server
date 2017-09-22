const fs = require('fs')

/**
 * _padUrl returns a url referencing a file, e.g.,
 * `/users/me.css`          -> `/users/me.css`
 * `/users/me.html#me`      -> `/users/me.html#me`
 * `/users/me.htm?foo-bar`  -> `/users/me.htm?foo-bar`
 * `/users`                 -> `/users/index.html`
 * `/users#me`              -> `/users/index.html#me`
 * `/users?foo-bar`         -> `/users/index.html?foo-bar`
 * @param  {String} url [description]
 * @return {String}     [description]
 */

const _replace = (match, p1) => {
  console.log(`match =`, match)
  console.log(`p1 =`, p1)
  return `${match}/index.html`
}

const _padUrl = url => {
  console.log(`url = ${url}`)
  // const regex = /\/[.^\.^\/^\#^\?]*(?:[(\#|\?)(.*^\#|\?)])$/
  // const regex = /[^#^\?^\..]*/
  const regex = /[^#^\?^\..]*\.[^\.^\/]*/
  const samples = [`/users/me.css`, `/users/me.html#me`, `/users/me.htm?foo-bar`, `/users`, `/users/bob`, `/users#me`, `/users?foo-bar`, `/users/bob?foo-bar`]
  samples.forEach(str => {
      const xxx = str.replace(regex, _replace)
      console.log(`${str}\t->\t${xxx}`)
    })
  return url
}

const static = (data, root, options) =>
  new Promise((resolve, reject) => {
    if (data.method !== 'GET' && data.method !== 'HEAD') {
      return resolve(undefined)
    }
    const file = `${root}${_padUrl(data.url)}`
    console.log(`file = ${file}`)
    fs.access(file, fs.constants.R_OK, (err) => {
      if (err) return resolve(undefined)
      return resolve(fs.createReadStream(file))
    })
  })

module.exports = {
  _padUrl,
  static,
}
