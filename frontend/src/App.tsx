import { Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AppLayout } from './routes/AppLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ActionListPage } from './pages/ActionListPage'
import { ActionFormPage } from './pages/ActionFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<ActionListPage />} />
          <Route path="actions/new" element={<ActionFormPage />} />
          <Route path="actions/:actionId/edit" element={<ActionFormPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}

export default App
