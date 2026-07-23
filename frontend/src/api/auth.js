import client from './client'

export const register = (data) => client.post('/auth/register', data)

export const login = (email, password) => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  return client.post('/auth/login', form)
}

export const getMe = () => client.get('/users/me')
