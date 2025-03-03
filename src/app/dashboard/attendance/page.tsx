import React from 'react';
import Face from './face'
import Attandace from './Attandace';
const page = () => {
  return (
    // <Box/>
    <div className=' px-7  w-full flex justify-start gap-10 '>

      {/* <div className=' w-fit items-center content-center flex justify-center '><Face /></div> */}
      <div className=' w-full items-center content-center  '><Attandace /></div>
    </div>

  );
}

export default page;
