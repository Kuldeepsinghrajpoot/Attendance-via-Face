import React from 'react'
import { Subject } from './table'
import { SubjectForm } from './subject-form'

function page() {
  return (
    <section className=' p-4 rounded-md  '>
      <div className='flex justify-start gap-2 h-12 max-h-min'>
        <SubjectForm/>
        {/* <SelectSubject/> */}
      </div>
      <div className=' p-4 my-4 items-center justify-center flex flex-col'>
        <Subject/>
      </div>
    </section>
  )
}

export default page
