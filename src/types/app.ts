import type { LucideIcon } from 'lucide-react'
import type { ROUTES } from '@/constants/app'

/** Every path the router serves, so a typo cannot reach a <Route> or a link. */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export type NavTab = {
  to: RoutePath
  label: string
  icon: LucideIcon
}
