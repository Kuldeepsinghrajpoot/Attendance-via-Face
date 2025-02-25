import React from 'react'
import { Subject } from './table'
import { SubjectForm } from './subject-form'
import { SelectSubject } from './select-subject'

function page() {
  return (
    <section className=' p-4 rounded-md  shadow-sm'>
      <div className='flex justify-start gap-2 h-12 max-h-min'>
        <SubjectForm/>
        <SelectSubject/>
      </div>
      <div className='bg-background border rounded-md p-4 my-4'>
        <Subject/>
      </div>
    </section>
  )
}

export default page
