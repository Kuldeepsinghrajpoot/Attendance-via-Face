import React from 'react';
import Face from './face'
import Attandace from './Attandace';
import axios from 'axios';
import { auth } from '@/app/api/auth';


async function fetchData({ id }: { id: string }): Promise<any> {
  try {
    const data = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/student-attendance?id=${id}`)
    return data.data
  } catch (error) {
    console.error('something went wrong', error)
  }
}
const page = async () => {
  const id = await auth();
  const response = await fetchData(id);

  // console.log(response)

  return (
    // <Box/>
    <div className=' px-7  w-full flex justify-start gap-10 '>
      <div className=' w-full items-center content-center  '><Attandace data={response?.data} /></div>
    </div>

  );
}

export default page;
