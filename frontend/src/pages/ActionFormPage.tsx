import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { createAction, getAction, type ActionPayload, type ActionPriority, type ActionStatus, updateAction } from '@/api/actions'
import { listTags } from '@/api/tags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/lib/queryClient'

const schema = z.object({
  title: z.string().min(1, 'عنوان لازم است'),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  due_date: z.string().optional(),
  tag_ids: z.array(z.number()).optional(),
})

type FormValues = z.infer<typeof schema>

const defaultValues: FormValues = {
  title: '',
  description: '',
  status: 'OPEN',
  priority: 'MEDIUM',
  due_date: '',
  tag_ids: [],
}

const mapToPayload = (values: FormValues): ActionPayload => ({
  title: values.title,
  description: values.description ?? '',
  status: values.status as ActionStatus,
  priority: values.priority as ActionPriority,
  due_date: values.due_date || null,
  tag_ids: values.tag_ids ?? [],
})

export const ActionFormPage = () => {
  const { actionId } = useParams<{ actionId: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(actionId)

  const tagsQuery = useQuery({ queryKey: ['tags'], queryFn: listTags })

  const actionQuery = useQuery({
    queryKey: ['action', actionId],
    queryFn: () => getAction(actionId as string),
    enabled: isEditing,
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues })

  useEffect(() => {
    if (actionQuery.data) {
      const action = actionQuery.data
      reset({
        title: action.title,
        description: action.description ?? '',
        status: action.status,
        priority: action.priority,
        due_date: action.due_date ?? '',
        tag_ids: action.tags.map((tag) => tag.id),
      })
    }
  }, [actionQuery.data, reset])

  const createMutation = useMutation({
    mutationFn: (payload: ActionPayload) => createAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      navigate('/app', { replace: true })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActionPayload }) => updateAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] })
      navigate('/app', { replace: true })
    },
  })

  const onSubmit = (values: FormValues) => {
    const payload = mapToPayload(values)

    if (isEditing && actionId) {
      updateMutation.mutate({ id: actionId, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{isEditing ? 'ویرایش اقدام' : 'ایجاد اقدام جدید'}</h2>
        <p className="text-sm text-slate-600">اطلاعات اقدام را تکمیل کنید.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="title">عنوان</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">توضیحات</Label>
          <Textarea id="description" rows={4} {...register('description')} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">وضعیت</Label>
            <Select id="status" {...register('status')}>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">اولویت</Label>
            <Select id="priority" {...register('priority')}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="due_date">سررسید (اختیاری)</Label>
            <Input id="due_date" type="date" {...register('due_date')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag_ids">تگ‌ها</Label>
            <Controller
              name="tag_ids"
              control={control}
              render={({ field }) => (
                <select
                  id="tag_ids"
                  multiple
                  value={field.value?.map(String) ?? []}
                  onChange={(event) =>
                    field.onChange(
                      Array.from(event.target.options)
                        .filter((option) => option.selected)
                        .map((option) => Number(option.value)),
                    )
                  }
                  className="h-32 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {(tagsQuery.data ?? []).map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>
        {(createMutation.isError || updateMutation.isError) && (
          <p className="text-sm text-red-600">ذخیره‌سازی انجام نشد. لطفاً اطلاعات را بررسی کنید.</p>
        )}
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/app')}>
            لغو
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'در حال ذخیره...' : isEditing ? 'به‌روزرسانی' : 'ایجاد'}
          </Button>
        </div>
      </form>
    </div>
  )
}
