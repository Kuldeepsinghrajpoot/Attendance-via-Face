import React from 'react'

import axios from 'axios'
import Record from './Record'

async function fetchData() {
    try {
        const data = await axios('http://localhost:3000/api/attendance')
        return data.data
    } catch (error) {
        console.error('something went wrong',error)
        
    }
}
async function AttendaceRecord() {
    const response = await fetchData()
  return (
    <div className='px-7 '>

        <Record Attendance={response.response}/>
    </div>
  )
}

export default AttendaceRecord
