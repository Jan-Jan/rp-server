module.exports = [
  {
    url: '/',
    method: 'POST',
    handler: data => ({
      statusCode: 201,
      body: 'it was made so',
    })
  }, {
    url: 'async',
    handler: async data => await Promise.resolve('meh'),
  }, {
    url: 'promise',
    handler: data => Promise.resolve('mook'),
  }
]
