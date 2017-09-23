const ws$ = require('../index')

test('check that Effect is a function', () => {
  expect(typeof ws$.Effect).toBe('function');
})
