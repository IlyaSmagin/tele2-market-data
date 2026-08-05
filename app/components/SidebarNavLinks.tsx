'use client'
// https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#active-nav-links

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Button from './button'
import { cn } from '@/lib/utils'

interface NavLink {
  href: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/internet', label: 'Internet', icon: '🌐' },
  { href: '/calls', label: 'Calls', icon: '☎️' },
  { href: '/sms', label: 'SMS', icon: '💬' },
  { href: '#', label: 'Settings', icon: '⚙️', disabled: true },
];

interface NavLinksProps {
  variant?: 'sidebar' | 'bottom';
}

export function NavLinks({ variant = 'sidebar' }: NavLinksProps) {
  const pathname = usePathname();

  if (variant === 'bottom') {
    return (
      <div className="flex items-center justify-around h-20 px-2">
        {navLinks.map((link) => (
          <Link key={link.label} href={link.href} className="flex-1">
            <Button 
              disabled={link.disabled}
              className={cn(
                'w-full h-16 flex flex-col items-center justify-center gap-1 rounded-none text-xs',
                pathname === link.href ? 'font-bold bg-gray-400/10' : ''
              )}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="hidden">{link.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    );
  }

  // Sidebar variant (default)
  return (
    <nav className="grid gap-2 px-4">
      {navLinks.map((link) => (
        <Link key={link.label} href={link.href}>
          <Button 
            disabled={link.disabled}
            className={cn(
              'w-full',
              pathname === link.href ? 'font-bold bg-gray-400/10 hover:bg-gray-400/10' : ''
            )}
          >
            <span className="mr-2">{link.icon}</span>
            {link.label}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
