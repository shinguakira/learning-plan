import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { MockUserProvider } from "@/components/layout/MockUserProvider"
import { ROUTES } from "@/constants/app"
import { useMockUser } from "@/hooks/useMockUser"
import { ChatPage } from "@/pages/chat/ChatPage"
import { ProfilePage } from "@/pages/profile/ProfilePage"
import { TasksPage } from "@/pages/tasks/TasksPage"

/** A user switch starts a fresh chat so earlier task snapshots are not carried over. */
function UserChatPage() {
  const { user } = useMockUser()
  return <ChatPage key={user} />
}

export function App() {
  return (
    <MockUserProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={ROUTES.tasks} replace />} />
          <Route path={ROUTES.tasks} element={<TasksPage />} />
          <Route path={ROUTES.chat} element={<UserChatPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path="*" element={<Navigate to={ROUTES.tasks} replace />} />
        </Route>
      </Routes>
    </MockUserProvider>
  )
}
