import { ListTodo, MessageCircle } from 'lucide-react'
import type { NavTab } from '@/types/app'

export const APP_TITLE = import.meta.env.VITE_APP_TITLE

export const ROUTES = {
  tasks: '/tasks',
  chat: '/chat',
} as const

export const TABS: readonly NavTab[] = [
  { to: ROUTES.tasks, label: 'Tasks', icon: ListTodo },
  { to: ROUTES.chat, label: 'AI chat', icon: MessageCircle },
]
