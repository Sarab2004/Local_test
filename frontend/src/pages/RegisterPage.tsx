import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { register as registerUser } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    email: z.string().email('ایمیل نامعتبر است'),
    password: z.string().min(8, 'گذرواژه باید حداقل ۸ کاراکتر باشد'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'گذرواژه‌ها یکسان نیستند',
  })

type FormValues = z.infer<typeof schema>

export const RegisterPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login', { replace: true })
    },
  })

  const onSubmit: SubmitHandler<FormValues> = ({ email, password }) => {
    mutation.mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">ثبت‌نام</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">گذرواژه</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تکرار گذرواژه</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          {mutation.isError && (
            <p className="text-sm text-red-600">ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.</p>
          )}
          <Button type="submit" className="w-full" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'در حال ارسال...' : 'ثبت‌نام'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          حساب دارید؟{' '}
          <Link className="text-primary" to="/login">
            ورود
          </Link>
        </p>
      </div>
    </div>
  )
}
