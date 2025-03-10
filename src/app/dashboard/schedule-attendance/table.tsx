
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
// Function to fetch user enrollments
async function fetchUserEnrollments({ id }: { id: string }) {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_PORT}/api/enroll-student?id=${id}`,
            { timeout: 5000 }
        );
        return res.data; // Should be an array of enrollment groups.
    } catch (error) {
        console.error("Error fetching enrollment data:", error);
        return { data: [] };
    }
}

export async function AttendanceSchedule() {
    // Get the teacher's basic details (role id) from auth.
    const res = await auth();
    const id = res?.role.id;

    // Fetch enrollment groups
    const response = await fetchUserEnrollments({ id });
    // Assuming the API returns the grouped data directly as response.data
    const enrollmentList = response.data || [];
    // console.log(enrollmentList);
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
                    <TableHead>Mark</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {enrollmentList.map((enroll: any, index: number) => {
                    
                    const{scheduleAttendance} = enroll;
                    console.log(scheduleAttendance);
                    const {startTime, endTime} = scheduleAttendance ?? "N/A";
                   
                    const formattedStart = formatDateTime(startTime);
                    const formattedEnd = formatDateTime(endTime);
                    return (
                        <TableRow key={index}>
                            <TableCell className="py-2">
                                {enroll.subject.subjectName}
                            </TableCell>
                            <TableCell className="py-2">
                                {enroll.session}
                            </TableCell>
                            <TableCell className="py-2">
                                {enroll.year}
                            </TableCell>
                            <TableCell className="py-2">
                                {enroll.batch.batch}
                            </TableCell>
                            <TableCell className="py-2">
                                {enroll.studentCount}
                            </TableCell>
                            <TableCell>{formattedStart.date!=='Invalid Date'?formattedStart.date:"N/A"}</TableCell>
                            <TableCell>{formattedStart.time!=='Invalid Date'?formattedStart.time:"N/A"}</TableCell>
                            <TableCell>{  formattedEnd.time!=='Invalid Date' ?formattedEnd.time : "N/A"}</TableCell>
                            <TableCell>
                                <DateTimePicker24hForm
                                    initialValues={{
                                        subjectId: enroll?.subject.id,
                                        sessionId: enroll?.session,
                                        batchId: enroll?.batch.id,
                                        year: enroll?.year,
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell
                        colSpan={9}
                        className="text-center font-semibold"
                    >
                        Ensure attendance is marked within the allocated time
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
