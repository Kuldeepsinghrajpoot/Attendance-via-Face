'use server'
import React, { useContext } from 'react';
import axios from 'axios'
import QuizQuestion from './[...id]/quiz'
import ImageCapture from '@/app/Camera/page';
import CaputreImage from './caputreImage';
// import Subject from './subjects'
import Subject from './Subjects'



const fetchData = async () => {

  const value = await axios.get('http://localhost:3000/api/mcqApi');
  return value.data
}


const Quiz = async () => {

  const data = await fetchData()
  if(!data){
    return null
  }

  return (
    <>

      {/* <QuizQuestion question={data.subject[0].viceSubjects[0].questions} /> */}
      <Subject Subject={data.subject}/>

    </>
  )
}

export default Quiz;
