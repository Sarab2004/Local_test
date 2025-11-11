import api from '@/lib/axios'

export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE'
export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type Tag = {
  id: number
  name: string
}

export type Action = {
  id: number
  title: string
  description: string
  status: ActionStatus
  priority: ActionPriority
  due_date: string | null
  tags: Tag[]
  created_at: string
  updated_at: string
}

export type ActionPayload = {
  title: string
  description?: string
  status: ActionStatus
  priority: ActionPriority
  due_date?: string | null
  tag_ids?: number[]
}

export const listActions = async (params: Record<string, string | number | undefined>) => {
  const { data } = await api.get<Action[]>('/api/actions/', { params })
  return data
}

export const getAction = async (id: string) => {
  const { data } = await api.get<Action>(`/api/actions/${id}/`)
  return data
}

export const createAction = async (payload: ActionPayload) => {
  const { data } = await api.post<Action>('/api/actions/', payload)
  return data
}

export const updateAction = async (id: string, payload: ActionPayload) => {
  const { data } = await api.put<Action>(`/api/actions/${id}/`, payload)
  return data
}

export const deleteAction = async (id: string | number) => {
  await api.delete(`/api/actions/${id}/`)
}
