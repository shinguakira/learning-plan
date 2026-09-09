import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ROUTES } from '@/constants/app'
import { ChatPage } from '@/pages/chat/ChatPage'
import { TasksPage } from '@/pages/tasks/TasksPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTES.tasks} replace />} />
        <Route path={ROUTES.tasks} element={<TasksPage />} />
        <Route path={ROUTES.chat} element={<ChatPage />} />
        <Route path="*" element={<Navigate to={ROUTES.tasks} replace />} />
      </Route>
    </Routes>
  )
}
