'use client'
import { useSession } from 'next-auth/react';
import React from 'react';

const page = () => {
 const{data:session}= useSession()

 console.log(session)
  return (
  <><div>
    {session?.user?.email},
    {session?.user?.rollNumber},
    {session?.user?.Firstname||session?.user?.name},


    
    
    </div></>
  );
}

export default page;
