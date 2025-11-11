import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { deleteAction, listActions, type ActionPriority, type ActionStatus } from '@/api/actions'
import { listTags } from '@/api/tags'
import { ActionCard } from '@/components/ActionCard'
import { FiltersBar } from '@/components/FiltersBar'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/queryClient'

type FiltersState = {
  status: ActionStatus | ''
  priority: ActionPriority | ''
  tagIds: number[]
  search: string
}

const initialFilters: FiltersState = {
  status: '',
  priority: '',
  tagIds: [],
  search: '',
}

export const ActionListPage = () => {
  const [filters, setFilters] = useState<FiltersState>({ ...initialFilters })
  const navigate = useNavigate()

  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: listTags })

  const actionsQuery = useQuery({
    queryKey: ['actions', filters],
    queryFn: () =>
      listActions({
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        tag: filters.tagIds.length ? filters.tagIds.join(',') : undefined,
        q: filters.search || undefined,
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
    },
  })

  const handleResetFilters = () => {
    setFilters({ ...initialFilters })
  }

  const onEdit = (id: number) => {
    navigate(`/app/actions/${id}/edit`)
  }

  const onDelete = (id: number) => {
    if (confirm('آیا از حذف این اقدام مطمئن هستید؟')) {
      deleteMutation.mutate(id)
    }
  }

  const tags = tagsQuery.data ?? []
  const actions = actionsQuery.data ?? []

  const isLoading = tagsQuery.isLoading || actionsQuery.isLoading

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900">اقدامات</h2>
        <Button type="button" onClick={() => navigate('/app/actions/new')}>
          اقدام جدید
        </Button>
      </div>
      <FiltersBar
        filters={filters}
        tags={tags}
        onChange={setFilters}
        onReset={handleResetFilters}
      />
      {isLoading && <p className="text-sm text-slate-600">در حال بارگذاری...</p>}
      {!isLoading && actions.length === 0 && (
        <p className="rounded-lg bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
          هیچ اقدامی یافت نشد.
        </p>
      )}
      <div className="grid gap-4">
        {actions.map((action) => (
          <ActionCard key={action.id} action={action} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}
