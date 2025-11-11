import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { login } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/routes/AuthContext'

const schema = z.object({
  email: z.string().email('ایمیل نامعتبر است'),
  password: z.string().min(8, 'گذرواژه باید حداقل ۸ کاراکتر باشد'),
})

type FormValues = z.infer<typeof schema>

type LocationState = {
  from?: Location
}

export const LoginPage = () => {
  const { login: loginUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState)?.from?.pathname ?? '/app'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginUser(data)
      navigate(from, { replace: true })
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    mutation.mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">ورود</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">گذرواژه</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          {mutation.isError && (
            <p className="text-sm text-red-600">ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.</p>
          )}
          <Button type="submit" className="w-full" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'در حال ورود...' : 'ورود'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          حساب کاربری ندارید؟{' '}
          <Link className="text-primary" to="/register">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </div>
  )
}
