const {
  _padUrl,
} = require('../static-routing')

describe('_padUrl', () => {
  test(`/users/me.css`, () => {
    expect(_padUrl(`/users/me.css`)).toBe(`/users/me.css`)
  })

  test(`/users/me.html#me`, () => {
    expect(_padUrl(`/users/me.html#me`)).toBe(`/users/me.html`)
  })

  test(`/users/me.htm?foo-bar`, () => {
    expect(_padUrl(`/users/me.htm?foo-bar`)).toBe(`/users/me.htm`)
  })

  test(`/`, () => {
    expect(_padUrl(`/`)).toBe(`/index.html`)
  })

  test(`/users`, () => {
    expect(_padUrl(`/users`)).toBe(`/users/index.html`)
  })

  test(`/users#me`, () => {
    expect(_padUrl(`/users#me`)).toBe(`/users/index.html`)
  })

  test(`/users?foo-bar`, () => {
    expect(_padUrl(`/users?foo-ba`)).toBe(`/users/index.html`)
  })
})
