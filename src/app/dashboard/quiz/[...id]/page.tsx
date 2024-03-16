
import axios from 'axios';
import * as React from "react"

import Quiz from './quiz';

const returnViceSubject = async ({ subject, viceSubject }: { subject: string, viceSubject: string }) => {

  // console.log('subject name',subject)
  // return

  const response = await axios.get(`http://localhost:3000/api/subject/${subject}/${viceSubject}`)

  return response.data
}

interface fatchType {
  key: any
  value: any
}
const page = async ({ params }: { params: { id: string } }) => {

  // console.log(params.id[2])
  // alert('hi')
  // return
  const data = await returnViceSubject({ subject: params.id[0], viceSubject: params.id[1] })

  return (
    <div className=' mx-7'>
      {data.subject.map((subject: any) => {
        return (<> 
        <div key={subject.id} className='bg-blue-800  px-5 rounded-md'>
         <div className='py-2 px-5  capitalize'> {subject.subjectName}</div>
          </div>
          {subject.viceSubjects.map((viceSubject: any) => {
            return (
              <div key={viceSubject.id}>
                <div className='bg-red-800  my-2 px-5 rounded-md'>
                  <div className='py-2 px-5  capitalize'>
                    {viceSubject.subjectName}
                  </div>
                </div>
                <Quiz key={viceSubject.id} question={viceSubject.questions} />

              </div>
            )
          })}
        </>)

      })}
    </div>
  )

}

export default page;


