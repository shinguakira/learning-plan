import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { AppLayout } from "@/components/layout/AppLayout"
import { MockUserProvider } from "@/components/layout/MockUserProvider"
import { ROUTES } from "@/constants/app"
import { ChatPage } from "@/pages/chat/ChatPage"
import { ProfilePage } from "@/pages/profile/ProfilePage"
import { TasksPage } from "@/pages/tasks/TasksPage"

export function App() {
  return (
    <MockUserProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={ROUTES.tasks} replace />} />
          <Route path={ROUTES.tasks} element={<TasksPage />} />
          <Route path={ROUTES.chat} element={<ChatPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path="*" element={<Navigate to={ROUTES.tasks} replace />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors closeButton />
    </MockUserProvider>
  )
}
