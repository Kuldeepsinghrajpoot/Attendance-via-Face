import React from 'react'
import  EnrollTable  from './table'
import { SubjectForm } from './subject-form'
import { SelectSubject } from './select-subject'

async function page({params}:{params:any}) {
  const{enrollStudent} = await params
 
  return (
    <section className=' p-4 rounded-md  '>
      <div className='flex justify-start gap-2 h-12 max-h-min'>
        {enrollStudent}
        <SubjectForm/>
        <SelectSubject/>
      </div>
      <div className='bg-background border rounded-md p-4 my-4'>
        <EnrollTable/>
      </div>
    </section>
  )
}

export default page
