'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import CameraCapture from "./capture";

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
    teacher: Teacher | null;
    attendance: boolean | null;
}

interface Batch {
    id: string;
    batch: string;
}

interface TeacherSubject {
    // Contains schedule attendance data that is teacher-specific.
    scheduleAttendance: ScheduleAttendance | ScheduleAttendance[] | null;
}

interface Enroll {
    session: string;
    year: string;
    batch: Batch;
    subject: Subject;
    teacherSubject: TeacherSubject;
}

interface AttendanceRecord {
    id: string;
    status: "PRESENT" | "ABSENT" | string;
    subjectId: string;
    scheduleId: string;
    createdAt: string;
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
    Attendance: AttendanceRecord[];
}

interface AttendanceTableProps {
    data: StudentData;
}

// Function to format date and time.
const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return { date: formattedDate, time: formattedTime };
};

export default function AttendanceTable({ data }: AttendanceTableProps) {
    if (!data?.Enroll || data.Enroll.length === 0) {
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
                        {data.Enroll.map((enroll, index) => {
                            // Normalize schedule attendance from teacherSubject.
                            const scheduleData = enroll.teacherSubject.scheduleAttendance
                                ? Array.isArray(enroll.teacherSubject.scheduleAttendance)
                                    ? enroll.teacherSubject.scheduleAttendance
                                    : [enroll.teacherSubject.scheduleAttendance]
                                : [];

                            // If no schedule data is found, render a row with "N/A".
                            if (scheduleData.length === 0) {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{enroll.session}</TableCell>
                                        <TableCell>{enroll.year}</TableCell>
                                        <TableCell>{enroll.batch.batch}</TableCell>
                                        <TableCell>{enroll.subject.subjectName}</TableCell>
                                        <TableCell>N/A</TableCell>
                                        <TableCell>N/A</TableCell>
                                        <TableCell>N/A</TableCell>
                                        <TableCell>
                                            <CameraCapture attendanceData={{
                                                subjectId: enroll.subject.id,
                                                scheduleId: "",
                                                date: "N/A",
                                                time: "N/A",
                                            }} />
                                        </TableCell>
                                    </TableRow>
                                );
                            }

                            // Render a row for each schedule item.
                            return scheduleData.map((schedule, scheduleIndex) => {
                                const formattedStart = formatDateTime(schedule.startTime);
                                const formattedEnd = formatDateTime(schedule.endTime);

                                // Check if attendance has been marked for this subject and schedule.
                                const isPresent = data.Attendance.some(
                                    (att) =>
                                        att.status === "PRESENT" &&
                                        att.subjectId === enroll.subject.id &&
                                        att.scheduleId === schedule.id
                                );

                                return (
                                    <TableRow key={`${index}-${scheduleIndex}`}>
                                        <TableCell>{enroll.session}</TableCell>
                                        <TableCell>{enroll.year}</TableCell>
                                        <TableCell>{enroll.batch.batch}</TableCell>
                                        <TableCell>{enroll.subject.subjectName}</TableCell>
                                        <TableCell>{formattedStart.date}</TableCell>
                                        <TableCell>{formattedStart.time}</TableCell>
                                        <TableCell>{formattedEnd.time}</TableCell>
                                        <TableCell>
                                            {isPresent ? (
                                                <span className="text-primary font-bold">PRESENT</span>
                                            ) : (
                                                <CameraCapture
                                                    attendanceData={{
                                                        subjectId: enroll.subject.id,
                                                        scheduleId: schedule.id,
                                                        date: formattedStart.date,
                                                        time: formattedStart.time,
                                                    }}
                                                    disabled={false}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            });
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
