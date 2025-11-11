import api from '@/lib/axios'

export type LoginResponse = {
  access: string
  refresh: string
  user: {
    id: number
    email: string
  }
}

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await api.post<LoginResponse>('/api/auth/login', credentials)
  return data
}

export const register = async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/api/auth/register', payload)
  return data
}
