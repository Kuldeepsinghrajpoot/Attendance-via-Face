import React from 'react'
import { Role } from './role-table'
import { RoleForm } from './role'


function page() {
  return (
    <section className=' p-4 rounded-md  shadow-sm'>
      <div className='flex justify-start gap-2 h-12 max-h-min'>
        <RoleForm/>
        {/* <SelectSubject/> */}
      </div>
      <div className='bg-background border rounded-md p-4 my-4'>
        <Role/>
      </div>
    </section>
  )
}

export default page
