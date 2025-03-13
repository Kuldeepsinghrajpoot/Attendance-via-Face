"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import CameraCapture from "./capture";
import { Input } from "@/components/ui/input";

type StudentRecord = {
    studentName: string;
    rollNumber: string;
    batch: string;
    subject: string;
    totalPresent: number;
    totalAbsent: number;
    id: string;
    subjectId: string;
};

type AttendanceData = {
    batch: string;
    subject: string;
    subjectId: string;
    students: {
        id: string;
        name: string;
        rollNumber: string;
    }[];
    totalPresent: number;
    totalAbsent: number;
};

type Props = {
    role: string;
    attendanceData: AttendanceData[];
};

const AttendanceTable = ({ attendanceData, role }: Props) => {
    const [batchFilter, setBatchFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // ✅ Debounce search input (waits 300ms before updating search)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    // ✅ Group data uniquely by student roll number, batch, and subject
    const groupedData: StudentRecord[] = useMemo(() => {
        const studentMap = new Map<string, StudentRecord>();

        attendanceData.forEach((record) => {
            record.students.forEach((student) => {
                const key = `${student.rollNumber}-${record.batch}-${record.subject}`;

                if (!studentMap.has(key)) {
                    studentMap.set(key, {
                        id: student?.id,
                        studentName: student.name,
                        rollNumber: student.rollNumber,
                        batch: record.batch,
                        subject: record.subject,
                        totalPresent: record.totalPresent,
                        totalAbsent: record.totalAbsent,
                        subjectId: record.subjectId
                    });
                }
            });
        });

        return Array.from(studentMap.values());
    }, [attendanceData]);

    // ✅ Apply batch, subject, and search filters
    const filteredData = useMemo(() => {
        return groupedData.filter(
            (student) =>
                (batchFilter === "all" || student.batch === batchFilter) &&
                (subjectFilter === "all" || student.subject === subjectFilter) &&
                (debouncedSearch === "" ||
                    student.studentName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    student.rollNumber.toLowerCase().includes(debouncedSearch.toLowerCase()))
        );
    }, [groupedData, batchFilter, subjectFilter, debouncedSearch]);

    // ✅ Extract unique batch and subject names for dropdown filters
    const uniqueBatches = useMemo(
        () => [...new Set(groupedData.map((student) => student.batch))],
        [groupedData]
    );

    const uniqueSubjects = useMemo(
        () => [...new Set(groupedData.map((student) => student.subject))],
        [groupedData]
    );

    return (
        <div className="p-4">
            {/* Filters */}
            <div className="flex gap-4 mb-4">
                {/* Batch Filter */}
                <Select value={batchFilter} onValueChange={setBatchFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Batches" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        {uniqueBatches.map((batch) => (
                            <SelectItem key={batch} value={batch}>
                                {batch}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Subject Filter */}
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {uniqueSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                                {subject}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* ✅ Search Input (Debounced) */}
                <Input
                    className="w-[250px] p-2 border rounded"
                    placeholder="Search by Name or Roll Number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Attendance Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Total Present</TableHead>
                        <TableHead>Total Absent</TableHead>
                        <TableHead>Mark</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                        filteredData.map((student, index) => (
                            <TableRow key={index}>
                                <TableCell>{student.studentName}</TableCell>
                                <TableCell>{student.rollNumber}</TableCell>
                                <TableCell>{student.batch}</TableCell>
                                <TableCell>{student.subject}</TableCell>
                                <TableCell>{student.totalPresent}</TableCell>
                                <TableCell>{student.totalAbsent}</TableCell>
                                <TableCell>
                                    <CameraCapture
                                        attendanceData={{
                                            id: student.id,
                                            subjectId: student.subjectId,
                                            role: role
                                        }}
                                        disabled={false}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                                No data available for the selected filters.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AttendanceTable;
