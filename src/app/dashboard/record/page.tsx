import React from 'react'
import axios from 'axios'
import Record from './Record'
import DatePickerDemo from './DatePicker'
import { auth } from '@/app/api/auth'

async function fetchData(date: any,id:any) {
    try {
        const data = await axios.get(`${process.env.NEXTAUTH_URL}/api/attendance-record?date=${new Date(date)|| new Date()}`)
        return data.data
    } catch (error) {
        console.error('something went wrong', error)
    }
}
async function AttendaceRecord({searchParams}:any) {
    const {date} = await searchParams;
    try {
        const role = await auth();
        const id = role?.role?.id;
        const response = await fetchData( date,id);
    
         
        // console.log(response);
        return (
            <div className='px-7 shadow-sm bg-background/80 rounded-md p-4 my-4 '>
                <DatePickerDemo />
                <Record data={response} date={date} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Error fetching data</div>;
    }
}
export default AttendaceRecord
