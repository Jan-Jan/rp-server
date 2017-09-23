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

const trailingCrap = /[#\?][^]*$/
const missingFile = /\/[^^.^\/]*$/

const _pad = (match, offset, string) =>
  `${string === '/' ? '' : string}/index.html`

const _padUrl = url =>
  url
    .replace(trailingCrap, '')
    .replace(missingFile, _pad)

const staticRouting = (root, options) => (data) =>
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
  staticRouting,
}
