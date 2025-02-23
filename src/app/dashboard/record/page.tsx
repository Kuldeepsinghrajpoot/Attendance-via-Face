import React from 'react'
import axios from 'axios'
import Record from './Record'
import DatePickerDemo from './DatePicker'

async function fetchData(date: any) {
    console.log('serverasfasd', process.env.PORT)
    try {
        const data = await axios(`${process.env.NEXTAUTH_URL}/api/dashboard-attendance?date=${new Date(date)|| new Date()}`)
        return data.data
    } catch (error) {
        console.error('something went wrong', error)
    }
}
async function AttendaceRecord({ searchParams }: any) {
    try {
        const response = await fetchData(searchParams?.date);
        // console.log(response);
        return (
            <div className='px-7 '>
                <DatePickerDemo />
                <Record Attendance={response?.response} count={response?.presentStudentsCount} totalStudent={response?.totalstudent} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Error fetching data</div>;
    }
}
export default AttendaceRecord
