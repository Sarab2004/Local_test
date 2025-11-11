import api from '@/lib/axios'

import type { Tag } from './actions'

export const listTags = async () => {
  const { data } = await api.get<Tag[]>('/api/tags/')
  return data
}
