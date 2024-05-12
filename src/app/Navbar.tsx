import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../darkMode/darkMode'

interface authUser {
  title: string
  url: string,
}

interface homepage {
  title: string
  url: string,
}
const auth: authUser[] = [
  {
    title: 'Sign In',
    url: './Login'
  },  {
    title: 'Sign Up',
    url: './Register'
  }
]
const homepage: homepage[] = [{
  title: 'Home',
  url: '/'
}, {
  title: 'About',
  url: '#'
}]
function Navbar() {
  return (


    <div className=' top-0 sticky z-50'>

      <div className='     h-14   w-full sticky z-50 top-0 flex '>

        <div className='sticky z-50 items-center  w-full    bg-background border flex justify-between  h-16'>
          <ul className='items-center flex justify-start gap-5 px-5 '>
            {homepage.map((item, id) => (
              <li key={id}><Link href={item.url}>{item.title}</Link></li>
            ))}
          </ul>
          <ul className=' items-center flex justify-end gap-5 px-5'>

            {auth.map((item, id) => (
              <li key={id}><Link href={item.url}>{item.title}  </Link></li>
            ))}
            <li><ModeToggle /></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
