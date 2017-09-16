const logger = require('pino-http')()

module.exports = ({ req, res }) => logger(req, res)
