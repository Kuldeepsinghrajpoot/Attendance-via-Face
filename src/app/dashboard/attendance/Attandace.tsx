'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import FaceVerify from "./face";

interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ScheduleAttendance {
    id: string;
    startTime: string;
    endTime: string;
}

interface Subject {
    id: string;
    subjectName: string;
    branch: string | null;
    teacher: Teacher;
    scheduleAttendance: ScheduleAttendance;
    attendance: boolean | null;
}

interface Batch {
    id: string;
    batch: string;
}

interface Enroll {
    session: string;
    year: string;
    batch: Batch;
    subject: Subject;
    teacher: Teacher;
}

interface StudentData {
    id: string;
    email: string;
    Firstname: string;
    lastname: string;
    avatar: string;
    password: string;
    rollNumber: string;
    batchId: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    phone: string | null;
    branchId: string | null;
    Enroll: Enroll[];
    Attendance: any[]; // Define if necessary
}

interface AttendanceTableProps {
    data: StudentData[];
}

// Function to format date and time
const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }); // Format: HH:MM:SS
    return { date: formattedDate, time: formattedTime };
};

export default function AttendanceTable({ data }: AttendanceTableProps) {
    if (!data || data.length === 0 || !data[0].Enroll || data[0].Enroll.length === 0) {
        return <p>No attendance data available.</p>;
    }

    return (
        <div className="md:flex md:justify-start gap-24">
            <div className="w-full dark:bg-background rounded-md px-6 py-5">
                <Table className="bg-inherit">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Session</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Schedule Date</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Attendance Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data[0].Enroll.map((enroll, index) => {
                            if (!enroll.subject || !enroll.subject.scheduleAttendance) return null;

                            const { session, year, batch, subject } = enroll;
                            const { scheduleAttendance } = subject;
                            const formattedStart = formatDateTime(scheduleAttendance.startTime);
                            const formattedEnd = formatDateTime(scheduleAttendance.endTime);

                            return (
                                <TableRow key={index}>
                                    <TableCell>{session}</TableCell>
                                    <TableCell>{year}</TableCell>
                                    <TableCell>{batch.batch}</TableCell>
                                    <TableCell>{subject.subjectName}</TableCell>
                                    <TableCell>{formattedStart.date}</TableCell>
                                    <TableCell>{formattedStart.time}</TableCell>
                                    <TableCell>{formattedEnd.time}</TableCell>
                                    <TableCell className="text-right">
                                    <button onClick={()=>alert("asdf") }>onClick</button>
                                       
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
