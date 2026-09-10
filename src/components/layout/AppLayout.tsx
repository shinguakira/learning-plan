import { NavLink, Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { APP_TITLE, TABS } from '@/constants/app'
import { cn } from '@/lib/utils'

export function AppLayout() {
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
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
