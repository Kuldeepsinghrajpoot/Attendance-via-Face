"use client";
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
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Check, X } from "lucide-react";

export default function TableDemo({ data, date }: any) {
    const currentMonth = new Date(date);
    const allDates = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    return (
        <div className="overflow-auto">
            <Table className="min-w-max">
                <TableCaption>Monthly Attendance Overview</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0">Roll Number</TableHead>
                        <TableHead className="sticky left-16">Student's Name</TableHead>
                        {allDates.map((date) => (
                            <TableHead key={date.toISOString()} className="text-center">
                                {format(date, "dd")}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.user?.map((student: any) => (
                        <TableRow key={student.id}>
                            <TableCell className="sticky left-0 font-medium">
                                {student?.rollNumber}
                            </TableCell>
                            <TableCell className="sticky left-16 uppercase">
                                {student?.Firstname}
                            </TableCell>
                            {allDates.map((date) => {
                                // Check if student was present on this date
                                const attendanceEntry = student?.Attendance?.some(
                                    (record: any) => format(new Date(record.createdAt), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                                );

                                return (
                                    <TableCell key={date.toISOString()} className="text-center">
                                        {attendanceEntry ? (
                                            <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <X className="h-3 w-3 text-red-500" />
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>Total Students: {data?.data?.totalstudent}</TableCell>
                        <TableCell className="text-right" colSpan={allDates.length}>
                            Present: {data?.data?.presentStudentsCount} | Absent: {data?.data?.totalstudent - data?.data?.presentStudentsCount}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
