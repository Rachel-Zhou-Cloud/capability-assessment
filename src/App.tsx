import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { AppShell } from '@/components/layout/AppShell'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { LoginPage } from '@/pages/LoginPage'
import { AssessmentPage } from '@/pages/AssessmentPage'
import { MyReportPage } from '@/pages/MyReportPage'
import { TeamReportPage } from '@/pages/TeamReportPage'
import { AdminPage } from '@/pages/AdminPage'

function AuthenticatedRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/assessment" element={
          <RoleGuard allowedRoles={['employee', 'supervisor', 'hr', 'admin']}>
            <AssessmentPage />
          </RoleGuard>
        } />
        <Route path="/my-report" element={
          <RoleGuard allowedRoles={['employee', 'supervisor', 'hr', 'admin']}>
            <MyReportPage />
          </RoleGuard>
        } />
        <Route path="/team-report" element={
          <RoleGuard allowedRoles={['supervisor', 'hr', 'admin']}>
            <TeamReportPage />
          </RoleGuard>
        } />
        <Route path="/admin" element={
          <RoleGuard allowedRoles={['hr', 'admin']}>
            <AdminPage />
          </RoleGuard>
        } />
        <Route path="*" element={<Navigate to="/assessment" replace />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={
          isAuthenticated ? <AuthenticatedRoutes /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </HashRouter>
  )
}
