const _isRegExUrl = ({ url }) => url.match('/:')
const _notRegExUrl = rt => !(_isRegExUrl(rt))

const _strip = url => url.replace(/\?.+/i, '')
const _key = ({ url, method }) => `${method || 'GET'}${_strip(url)}`
const _buildHash = (hash, route) => Object.assign({ [_key(route)]: route.handler }, hash)

const _buildRegs = (regs, route) => [...regs, route]
const _split = ({ url }) => _strip(url).split('/')

const _findRegs = req => {

  const paths = _split(req)
  return route => {

    const sections = _split(route)
    if (paths.length !== sections.length) return false
    return sections.every((sctn, ndx) => {
      if (sctn[0] === ':') return true
      // check if all the non variable names are exactly the same
      return sctn === paths[ndx]
    })
  }
}

const _params = (sections, paths) => (prms, idx) =>
  Object.assign({ [sections[idx].slice(1)]: paths[idx]}, prms)

const route = rawRoutes => {

  const routes = (Array.isArray(rawRoutes)
    ? rawRoutes
    : [rawRoutes])
    .map(route => Object.assign(route, { url: route.url[0] === '/' ? route.url : '/' + route.url }))

  const hash = routes
    .filter(_notRegExUrl)
    .reduce(_buildHash, {})
  const regs = routes
    .filter(_isRegExUrl)
    .reduce(_buildRegs, [])

  return req => {

    const key = _key(req)
    // if in hash, then route
    if (hash.hasOwnProperty(key)) return hash[key](req)
    // if in regs, then route
    const index = regs.findIndex(_findRegs(req))
    if (index > -1) {
      const route = regs[index]
      const paths = _split(req)
      const sections = _split(route)
      const varIndices = sections
        .map((section, index) => section[0] === ':' ? index : -1)
        .filter(index => index > -1)
      req.params = varIndices.reduce(_params(sections, paths), {})
      return regs[index].handler(req)
    }
    // not found
    return
  }
}

module.exports = {
  route,
  _buildHash,
  _buildRegs,
  _findRegs,
  _notRegExUrl,
  _isRegExUrl,
}
