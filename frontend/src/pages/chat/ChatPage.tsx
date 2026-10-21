import { useMockUser } from "@/hooks/useMockUser"
import { ChatConversation } from "@/pages/chat/ChatConversation"

export function ChatPage() {
  const { user } = useMockUser()

  return <ChatConversation key={user} />
}
