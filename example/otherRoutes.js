module.exports = [
  {
    url: '/',
    method: 'POST',
    handler: req => ({
      statusCode: 201,
      body: 'it was made so',
    })
  }, {
    url: '/name/:name',
    method: 'POST',
    handler: req => ({
      body: `Hello ${req.params.name}`,
    })
/*
  }, {
    url: 'async',
    handler: async data => await Promise.resolve('meh'),
  }, {
    url: 'promise',
    handler: data => Promise.resolve('mook'),
*/
  }
]
