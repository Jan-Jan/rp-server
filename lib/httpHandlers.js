module.exports = {
  logger: ({ req: { method, url } }) => console.log(`${method}:${url}`),
}
