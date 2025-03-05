import { format, differenceInMinutes } from "date-fns";

import { auth } from "@/app/api/auth";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { DateTimePicker24hForm } from "./date";

// Function to fetch user enrollments
async function fetchUserEnrollments(id: string) {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_PORT}/api/teacher?id=${id}`,
            { timeout: 5000 }
        );
        return res.data; 
    } catch (error) {
        console.error("Error fetching enrollment data:", error);
        return { data: { getUser: [] } };
    }
}

export async function AttendanceSchedule() {
    // Authenticate and get the user ID
    const res = await auth();
    const id = res?.role?.id;
    if (!id) return <p className="text-red-500">Invalid user ID.</p>;

    // Fetch enrollment data
    const response = await fetchUserEnrollments(id);
    const user = response?.data?.getUser?.[0];

    // Ensure user and enrollments exist
    if (!user || !user.Enroll || !user.subjects) {
        return <p className="text-red-500">No enrollment data found.</p>;
    }

    // Group enrollments by subject and batch
    const groupedEnrollments = user.Enroll.reduce((acc: any, enroll: any) => {
        const key = `${enroll.subject.id}-${enroll.batch.id}`;
        if (!acc[key]) {
            acc[key] = {
                subject: enroll.subject.subjectName,
                session: enroll.session,
                year: enroll.year,
                batch: enroll.batch.batch,
                batchId: enroll.batch.id,
                subjectId: enroll.subject.id,
                count: 0,
            };
        }
        acc[key].count += 1; // Count students in each subject-batch
        return acc;
    }, {});

    // Convert grouped enrollments into an array and attach attendance schedule
    const enrollmentList = Object.values(groupedEnrollments).map((entry: any) => {
        const subjectData = user.subjects.find(
            (sub: any) => sub.id === entry.subjectId
        );
        return {
            ...entry,
            attendanceSchedule: subjectData?.scheduleAttendance || {},
        };
    });

    return (
        <Table>
            <TableCaption>
                College Schedule for Attendance Marking (20 min)
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Session (Academic Year)</TableHead>
                    <TableHead>Study Year</TableHead>
                    <TableHead>Student Count</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Add Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {enrollmentList.map((entry: any, index: number) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{entry.subject}</TableCell>
                        <TableCell>Batch {entry?.batch}</TableCell>
                        <TableCell>2024-{entry?.session}</TableCell>
                        <TableCell>{entry?.year}</TableCell>
                        <TableCell>{entry?.count}</TableCell>
                        <TableCell>{(entry?.attendanceSchedule.startTime, "PPPP HH:mm") || "N/A"}</TableCell>
                        <TableCell>{(entry?.attendanceSchedule.endTime, "PPPP HH:mm") || "N/A"}</TableCell>
                        <TableCell>
                            <DateTimePicker24hForm
                                initialValues={{
                                    subjectId: entry?.subjectId,
                                    sessionId: entry?.session,
                                    batchId: entry?.batchId,
                                    year: entry?.year
                                }}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={8} className="text-center font-semibold">
                        Ensure attendance is marked within the allocated
                        20-minute duration.
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
