import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../darkMode/darkMode'
import { Ghost, HistoryIcon, HomeIcon, User, UserPlus2Icon } from 'lucide-react'
import { FaRegistered, FaRegRegistered } from 'react-icons/fa'
import { Login } from './(Auth)/login'
import Register from './(Auth)/register/page'
import { Button } from '@/components/ui/button'

interface authUser {
  title: string
  url: React.ElementType
  icon: React.ElementType
}

interface homepage {
  title: string
  url: string
  icon: React.ElementType
}

const auth: authUser[] = [
  {
    title: 'Sign In',
    url: Login,
    icon: User,
  },
  {
    title: 'Sign Up',
    url: Register,
    icon: FaRegistered,
  },
]

const homepage: homepage[] = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'About',
    url: '#',
    icon: HistoryIcon,
  },
]

function Navbar() {
  return (
    <div className="top-0 sticky z-50  backdrop-blur-sm border-b ">
      <div className=" h-16 w-full flex items-center px-24 justify-between">
        {/* Left - Homepage Links */}
        <ul className="flex items-center gap-5">
          {homepage.map((item, id) => (
            <li key={id}>
              <Link href={item.url} className="flex items-center gap-2 hover:text-blue-600">
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right - Auth Links */}
        <ul className="flex items-center gap-5">

          <li >
            <Login />
          </li>
          <li >
            <Button variant={"ghost"}>
              <Link href={"/register"} className='flex justify-center items-center space-x-1'>
                <div>
                  <UserPlus2Icon />
                </div>
                <span>
                  Register
                </span>
              </Link>
            </Button>

          </li>

          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
