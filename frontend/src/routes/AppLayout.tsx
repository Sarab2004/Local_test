import { Link, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from './AuthContext'
import { Button } from '@/components/ui/button'

export const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/app" className="text-lg font-semibold text-primary">
            HSE Action Tracker Lite
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{user?.email}</span>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              خروج
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
