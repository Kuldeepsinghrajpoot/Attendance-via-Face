import React from 'react'

function Work() {
  return (
    <div className=' bg-background h-full w-full border rounded-md my-5  '>
      <div className="  w-full h-full  my-7 px-5 py-5">
        <div className='py-10 w-full h-full '>
         
          <div className='bg-background   w-full p-6'>
            <h2 className='text-2xl font-bold mb-4'>Using Face-Based Attendance Marking with a Web Application</h2>
            <p className='mb-4'>
              Face-based attendance systems leverage facial recognition technology to streamline and automate the process of tracking attendance. Here’s how you can use such a system with a web application:
            </p>
            <ul className='list-disc list-inside mb-4'>
              <li>
                <strong>Setup:</strong> Start by creating a Next.js project and installing necessary dependencies like NextAuth.js, Prisma, and Axios.
                <br />
                <code>npx create-next-app@latest my-attendance-app --typescript</code>
                <br />
                <code>npm install next-auth @prisma/client @next-auth/prisma-adapter axios</code>
              </li>
              <li>
                <strong>Initialize Prisma:</strong> Set up Prisma with MongoDB by configuring your <code>schema.prisma</code> and migrating the schema.
                <br />
                <code>npx prisma init</code>
                <br />
                <code>npx prisma db push</code>
              </li>
              <li>
                <strong>Setup FastAPI Server:</strong> Create a FastAPI server using Python and OpenCV to handle face recognition.
                <br />
                Install FastAPI and OpenCV: <code>pip install fastapi uvicorn opencv-python</code>
                <br />
                Create an API in FastAPI for face recognition.
              </li>
              <li>
                <strong>Connect FastAPI and Next.js:</strong> Make API calls from your Next.js app to the FastAPI server for face recognition.
                <br />
                Create an API route in Next.js to handle image uploads and forward them to FastAPI.
              </li>
              <li>
                <strong>Authentication with NextAuth.js:</strong> Set up authentication in your Next.js application using NextAuth.js and Prisma.
                <br />
                Configure providers and adapters in <code>[...nextauth].ts</code>.
              </li>
              <li>
                <strong>Enrollment:</strong> Capture and store images of users’ faces in the MongoDB database.
              </li>
              <li>
                <strong>Detection:</strong> Users look into a camera connected to the system, which captures a live image or video stream.
              </li>
              <li>
                <strong>Recognition:</strong> The system compares the live image with stored facial data using a facial recognition algorithm to verify the user’s identity.
              </li>
              <li>
                <strong>Logging:</strong> Once identified, the system logs the attendance automatically, updating the records with the user’s check-in or check-out time.
              </li>
              <li>
                <strong>Security:</strong> Ensure data privacy and security by encrypting facial data and complying with relevant data protection regulations.
              </li>
              <li>
                <strong>Maintenance:</strong> Regularly update the facial recognition model and retrain it with new data to maintain accuracy and performance.
              </li>
            </ul>
            <p>
              By implementing a face-based attendance marking system, organizations can reduce manual errors, save time, and enhance security.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Work
