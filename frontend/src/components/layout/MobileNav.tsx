import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TABS } from '@/constants/app'
import { cn } from '@/lib/utils'

/**
 * The same destinations as the header tab row, behind one button. Shown only
 * where the row does not fit, so a screen that can show the tabs never shows both.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Menu"
          className="sm:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }),
                  'justify-start',
                  !isActive && 'text-muted-foreground',
                )
              }
            >
              <tab.icon />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
