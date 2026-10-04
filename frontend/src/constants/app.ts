import { ListTodo, MessageCircle, User } from 'lucide-react'
import type { NavTab } from '@/types/app'

export const APP_TITLE = import.meta.env.VITE_APP_TITLE

export const ROUTES = {
  tasks: '/tasks',
  chat: '/chat',
  profile: '/profile',
} as const

export const TABS: readonly NavTab[] = [
  { to: ROUTES.tasks, label: 'Tasks', icon: ListTodo },
  { to: ROUTES.chat, label: 'AI chat', icon: MessageCircle },
  { to: ROUTES.profile, label: 'Profile', icon: User },
]

/**
 * Tailwind's `sm`. The header swaps between the tab row and the drawer here, so
 * the one place that needs it in JS reads it from the same number the classes use.
 */
export const TAB_ROW_FITS = '(min-width: 40rem)'
