'use client'
// https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#active-nav-links

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from './themeToggle'
import Button from './button'
import { cn } from '@/lib/utils'

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 px-4">
      <Link href="/home" >
        <Button className={cn({'font-bold bg-gray-400/10 hover:bg-inhereit' : (pathname === '/home')})}>
          Home
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button className={cn({'font-bold bg-gray-400/10 hover:bg-inhereit' : (pathname === '/dashboard')})}>
        Dashboard
        </Button>
      </Link>
      <Link href="internet">
        <Button className={cn({'font-bold bg-gray-400/10 hover:bg-inhereit' : (pathname === '/internet')})}>
        Internet
        </Button>
      </Link>
      <Button disabled >
        Calls
      </Button>
      <Button disabled >
        Messages
      </Button>
      <Button disabled >
        Settings
      </Button>
      <ThemeToggle />

    </nav>
  )
}