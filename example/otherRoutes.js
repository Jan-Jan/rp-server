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
    handler: req => ({
      msg: `Hello ${req.params.name}`,
    })
  }, {
    url: 'user',
    method: 'POST',
    handler: data => Promise.resolve({ statusCode: 201, body: 'user created' }),
  }, {
    url: '*',
    handler: req => {
      const err = new Error('route not found')
      err.statusCode = 404
      throw err
    },
  }
]
