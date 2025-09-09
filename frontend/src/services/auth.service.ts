import api from './api'

type LoginResponse = {
  token: string
  expiresIn: number
  user: { id: string; email: string; firstName: string; lastName: string }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/v1/auth/login', { email, password })
  return data
}

