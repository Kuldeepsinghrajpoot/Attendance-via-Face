import React from 'react'
import { AttendanceSchedule } from './table'


function page() {
  return (
    <section className=' p-4 '>
     
      <div className='bg-background border rounded-md p-4 my-4'>
        <AttendanceSchedule/>
      </div>
    </section>
  )
}

export default page
