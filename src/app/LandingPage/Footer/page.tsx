import React from 'react'

function Footer() {
  return (
    <div className='h-full w-full bg-background border-t'>
      <div className="px-5 py-5 items-center text-center ">
      © Copyright {new Date().getFullYear()} Typing Speed
      </div>
    </div>
  )
}

export default Footer
