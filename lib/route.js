const _isRegExUrl = ({ url }) => false
const _notRegExUrl = rt => !(_isRegExUrl(rt))
const _buildHash = (hash, route) => Object.assign({ [_key(route)]: route.handler }, hash)
const _buildRegs = (regs, route) => [...regs, route]
const _findRegs = url => false
const _key = ({ url, method }) => url

const route = rawRoutes => {
  const routes = Array.isArray(rawRoutes)
    ? rawRoutes
    : [rawRoutes]

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
    const index = regs.findIndex(_findRegs)
    if (index > -1) return regs[index](req)
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
