import React from 'react'

function About() {
  return (
    <div className='py-10 w-full h-full flex justify-between'>
  <div className='  h-full w-full flex justify-center items-center'>
    <img className='object-cover text-center flex justify-center items-center object-center' src="https://www.spec-india.com/wp-content/uploads/2022/09/AI-Attendance-Management-System.png" alt="AI Attendance Management System" />
  </div>
  <div className='bg-background border h-full w-full p-6'>
  <div>
      <h2 className="text-xl font-bold mb-4">How to Use Face-Based Attendance Marking:</h2>
      <p className="mb-4">1. Navigate to the dashboard page.</p>
      <p className="mb-4">2. Go to the attendance page.</p>
      <p className="mb-4">3. The camera will automatically open.</p>
      <p className="mb-4">4. If your attendance is already marked, it will be displayed.</p>
      <p className="mb-4">5. If not, position your face in front of the camera.</p>
      <p className="mb-4">6. The system will verify your face and mark your attendance.</p>
    </div>
  </div>
</div>

  )
}

export default About
