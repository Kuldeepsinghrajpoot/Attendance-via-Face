import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { Attendance, PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

// ✅ Function to check if attendance is already marked for the student today
async function getAttendanceForDate(studentId: string, subjectId: string, date: Date): Promise<Attendance | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.attendance.findFirst({
        where: {
            studentId,
            subjectId,
            createdAt: { gte: startOfDay, lt: endOfDay },
        },
    });
}

export async function POST(req: NextRequest): Promise<Response> {
    try {
        // ✅ Get `id` from request query
        const id = req.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json(new ApiError(400, "Bad Request", "ID not provided"));

        // ✅ Extract request body
        const { avatar, subjectId, id: studentId, role } = await req.json();
        if (!avatar || !subjectId || !studentId)
            return NextResponse.json(new ApiError(400, "Bad Request", "Missing required parameters"));

        // ✅ If role is "teacher", do not mark attendance
        if (role === "teacher") {
            return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Teachers do not need to mark attendance" }));
        }

        // ✅ Find student by avatar and ID
        const user = await prisma.student.findFirst({
            where: { avatar: `${avatar}.jpeg`, id: studentId },
            select: { id: true, Firstname: true, lastname: true, rollNumber: true, batchId: true, role: true, phone: true, branchId: true },
        });

        if (!user) return NextResponse.json(new ApiError(404, "Not Found", "Student not found"));

        // ✅ Check if the student already marked attendance today
        const attendanceForToday = await getAttendanceForDate(user.id, subjectId, new Date());
        if (attendanceForToday) {
            return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Attendance already marked" }));
        }

        // ✅ Mark attendance
        await prisma.attendance.create({
            data: {
                studentId: user.id,
                subjectId,
                status: "PRESENT",
                batchId: user.batchId,
            },
        });

        return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Attendance marked successfully" }));
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(new ApiError(500, "Internal Server Error", "Failed to mark attendance"));
    }
}

export async function GET(req: NextRequest): Promise<Response> {
    try {
        const teacherId = req?.nextUrl?.searchParams?.get("id");

        if (!teacherId || !ObjectId.isValid(teacherId)) {
            return NextResponse.json(
                new ApiError(400, "Invalid or missing teacherId")
            );
        }

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find batches and subjects assigned to the teacher
        const teacherSubjects = await prisma.teacherSubject.findMany({
            where: { teacherId },
            select: {
                subjectId: true,
                BatchId: true,
            },
        });

        if (!teacherSubjects.length) {
            return NextResponse.json(
                new ApiError(404, "No assigned batches or subjects found")
            );
        }

        // Extract batchIds and subjectIds
        const batchIds = teacherSubjects
            .map((ts) => ts.BatchId)
            .filter((id) => id !== null);
        const subjectIds = teacherSubjects.map((ts) => ts.subjectId);

        // Fetch students enrolled in the teacher's batches and subjects
        const students = await prisma.student.findMany({
            where: { batchId: { in: batchIds } },
            select: {
                id: true,
                Firstname: true,
                lastname: true,
                email: true,
                rollNumber: true,
                batch: { select: { id: true, batch: true } }, // Include batch details
                branch: { select: { id: true, branchName: true } }, // Include branch details
                Enroll: {
                    where: { subjectId: { in: subjectIds } },
                    select: {
                        batch: { select: { id: true, batch: true } },
                        subject: { select: { id: true, subjectName: true } },
                    },
                },
                Attendance: {
                    where: {
                        createdAt: { gte: today, lt: tomorrow }, // Filter today's attendance
                    },
                    select: {
                        id: true,
                        status: true,
                        subjectId: true,
                    },
                },
            },
        });

        if (!students.length) {
            return NextResponse.json(
                new ApiError(404, "No students found for the given teacher")
            );
        }

        // Grouping attendance counts by batch, branch, and subject
        const attendanceSummary: Record<
            string,
            {
                batch: string;
                branch: string;
                subject: string;
                subjectId: string;
                totalPresent: number;
                totalAbsent: number;
                students: {
                    id: string
                    name: string;
                    rollNumber: string;
                    email: string;
                    status: string;
                }[];
            }
        > = {};

        students.forEach((student) => {
            student.Enroll.forEach((enrollment) => {
                const key = `${enrollment.batch.batch}-${student.branch.branchName}-${enrollment.subject.subjectName}`;

                if (!attendanceSummary[key]) {
                    attendanceSummary[key] = {
                        batch: enrollment.batch.batch,
                        branch: student.branch.branchName,
                        subject: enrollment.subject.subjectName,
                        subjectId: enrollment.subject.id,
                        totalPresent: 0,
                        totalAbsent: 0,
                        students: [],
                    };
                }

                // Determine attendance status for each student
                let status = "NOT_MARKED";
                student.Attendance.forEach((att) => {
                    if (att.subjectId === enrollment.subject.id) {
                        status = att.status;
                    }
                });

                if (status === "PRESENT") {
                    attendanceSummary[key].totalPresent += 1;
                } else if (status === "NOT_MARKED") {
                    attendanceSummary[key].totalAbsent += 1;
                }

                // Add student details
                attendanceSummary[key].students.push({
                    name: `${student.Firstname} ${student.lastname}`,
                    rollNumber: student.rollNumber,
                    email: student.email,
                    status,
                    id: student.id
                });
            });
        });

        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: Object.values(attendanceSummary),
            })
        );
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            new ApiError(500, "Something went wrong", error)
        );
    }
}
