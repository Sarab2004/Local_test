import { useMemo } from 'react'

import type { ActionPriority, ActionStatus, Tag } from '@/api/actions'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'

type Filters = {
  status: ActionStatus | ''
  priority: ActionPriority | ''
  tagIds: number[]
  search: string
}

type Props = {
  filters: Filters
  tags: Tag[]
  onChange: (filters: Filters) => void
  onReset: () => void
}

export const FiltersBar = ({ filters, tags, onChange, onReset }: Props) => {
  const tagOptions = useMemo(() => [...tags].sort((a, b) => a.name.localeCompare(b.name)), [tags])

  const handleStatusChange = (value: string) => {
    onChange({ ...filters, status: value as Filters['status'] })
  }

  const handlePriorityChange = (value: string) => {
    onChange({ ...filters, priority: value as Filters['priority'] })
  }

  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value })
  }

  const handleTagChange = (options: HTMLOptionsCollection) => {
    const selected = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => Number(option.value))
    onChange({ ...filters, tagIds: selected })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="status">وضعیت</Label>
          <Select id="status" value={filters.status} onChange={(event) => handleStatusChange(event.target.value)}>
            <option value="">همه</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">اولویت</Label>
          <Select id="priority" value={filters.priority} onChange={(event) => handlePriorityChange(event.target.value)}>
            <option value="">همه</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">تگ‌ها</Label>
          <select
            id="tags"
            multiple
            value={filters.tagIds.map(String)}
            onChange={(event) => handleTagChange(event.target.options)}
            className="h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {tagOptions.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="search">جستجو</Label>
          <Input
            id="search"
            placeholder="عنوان یا توضیح"
            value={filters.search}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" onClick={onReset}>
          پاک کردن فیلترها
        </Button>
      </div>
    </div>
  )
}
