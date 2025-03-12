import { auth } from '@/app/api/auth';
import axios from 'axios'
import React from 'react'
import AttendanceTable from './mark';

async function getData({ id }: { id: string }) {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/mark-attendance-by-teacher?id=${id}`, { timeout: 5000 });
        return res.data.data || [];
    } catch (error) {
        console.error("Error fetching data:", error);
        return { data: [] };
    }
}
async function Mark() {
    const res = await auth()
    const id = res?.role?.id;
const role = res?.role?.role

    const response = await getData({ id });
    return (
        <div className='bg-background rounded'>
            <AttendanceTable attendanceData={response} role={role} />
        </div>
    )
}

export default Mark
