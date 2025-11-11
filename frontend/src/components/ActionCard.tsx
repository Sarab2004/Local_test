import { format } from 'date-fns'

import type { Action } from '@/api/actions'
import { Button } from './ui/button'

const statusColors: Record<Action['status'], string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  DONE: 'bg-emerald-100 text-emerald-700',
}

const priorityColors: Record<Action['priority'], string> = {
  LOW: 'bg-slate-200 text-slate-700',
  MEDIUM: 'bg-indigo-100 text-indigo-700',
  HIGH: 'bg-rose-100 text-rose-700',
}

type Props = {
  action: Action
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export const ActionCard = ({ action, onEdit, onDelete }: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{action.title}</h3>
          {action.description && <p className="mt-2 text-sm text-slate-600">{action.description}</p>}
        </div>
        <div className="flex flex-col items-end gap-2 text-xs font-medium">
          <span className={`rounded-full px-3 py-1 ${statusColors[action.status]}`}>{action.status}</span>
          <span className={`rounded-full px-3 py-1 ${priorityColors[action.priority]}`}>{action.priority}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {action.tags.map((tag) => (
          <span key={tag.id} className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
            #{tag.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div>
          {action.due_date && (
            <span>
              سررسید: {format(new Date(action.due_date), 'yyyy-MM-dd')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => onEdit(action.id)}>
            ویرایش
          </Button>
          <Button type="button" variant="ghost" className="text-red-600" onClick={() => onDelete(action.id)}>
            حذف
          </Button>
        </div>
      </div>
    </div>
  )
}
