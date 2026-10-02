import { NavLink, Outlet } from 'react-router-dom'
import { GraduationCap, User } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_TITLE, TABS } from '@/constants/app'
import { MOCK_USER_COLOR, MOCK_USERS } from '@/constants/user'
import { useMockUser } from '@/hooks/useMockUser'
import { cn } from '@/lib/utils'
import type { MockUser } from '@/types/user'

export function AppLayout() {
  const { user, setUser } = useMockUser()

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 shrink-0 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
              <GraduationCap className="size-4" />
            </span>
            <span className="text-sm font-semibold">{APP_TITLE}</span>
          </div>

          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
                    !isActive && 'text-muted-foreground',
                  )
                }
              >
                <tab.icon />
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <Select value={user} onValueChange={(value) => setUser(value as MockUser)}>
            <SelectTrigger className="ml-auto w-32" aria-label="Active user">
              <User className={MOCK_USER_COLOR[user]} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_USERS.map((name) => (
                <SelectItem key={name} value={name}>
                  <User className={MOCK_USER_COLOR[name]} />
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
