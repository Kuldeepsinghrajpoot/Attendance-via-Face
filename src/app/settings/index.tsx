

import { Separator } from '@radix-ui/react-separator'
import SidebarNav from './components/sidebar-nav'
import { AlertCircle, Palette, User } from 'lucide-react'
import { FaFirefoxBrowser, FaToolbox } from 'react-icons/fa'

export default function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
    
      <div >
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            {/* <Outlet /> */}
          </div>
        </div>
      </div>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <User size={18} />,
    href: '/settings',
  },
  {
    title: 'Account',
    icon: <FaToolbox size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    icon: <Palette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <AlertCircle size={18} />,
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    icon: <FaFirefoxBrowser size={18} />,
    href: '/settings/display',
  },
]
