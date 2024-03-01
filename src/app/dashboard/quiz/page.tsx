import React from 'react';
import axios from 'axios'
import QuizQuestion from './quiz'
const fetchData = async () => {

  const value = await axios.get('http://localhost:3000/api/mcqApi');
  return value.data.question
}

const Quiz = async () => {
  const data = await fetchData();
  console.log(data)
  return (
    <>
   <QuizQuestion question={data}/>
    </>
  )
}

export default Quiz;
