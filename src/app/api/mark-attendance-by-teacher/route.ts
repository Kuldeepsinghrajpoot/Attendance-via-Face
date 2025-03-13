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
        if (role === "TEACHER") {
            // return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Teachers do not need to mark attendance" }));
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
        }
        
        return NextResponse.json(new ApiError(403, "Forbidden", "Only teachers can mark student attendance"));

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(new ApiError(500, "Internal Server Error", "Failed to mark attendance"));
    }
}

export async function GET(req: NextRequest): Promise<Response> {
    try {
        const teacherId = req?.nextUrl?.searchParams?.get("id");

        if (!teacherId || !ObjectId.isValid(teacherId)) {
            return NextResponse.json(new ApiError(400, "Invalid or missing teacherId"));
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // ✅ Step 1: Find today's attendance schedule
        const schedule = await prisma.scheduleAttendance.findFirst({
            where: {
                teacherId,
                startTime: { gte: today, lt: tomorrow },
            },
        });

        if (!schedule) {
            return NextResponse.json(new ApiError(404, "No attendance schedule found for today"));
        }

        // ✅ Step 2: Find assigned subjects and batches
        const teacherSubjects = await prisma.teacherSubject.findMany({
            where: { teacherId },
            select: {
                subjectId: true,
                BatchId: true,
            },
        });

        if (!teacherSubjects.length) {
            return NextResponse.json(new ApiError(404, "No assigned batches or subjects found"));
        }

        const batchIds = teacherSubjects.map((ts) => ts.BatchId).filter((id) => id !== null);
        const subjectIds = teacherSubjects.map((ts) => ts.subjectId);

        // ✅ Step 3: Fetch student details
        const students = await prisma.student.findMany({
            where: { batchId: { in: batchIds } },
            select: {
                id: true,
                Firstname: true,
                lastname: true,
                email: true,
                rollNumber: true,
                batch: { select: { id: true, batch: true } },
                branch: { select: { id: true, branchName: true } },
                Enroll: {
                    where: { subjectId: { in: subjectIds } },
                    select: {
                        batch: { select: { id: true, batch: true } },
                        subject: { select: { id: true, subjectName: true } },
                    },
                },
                Attendance: {
                    where: { scheduleId: schedule.id },
                    select: {
                        id: true,
                        status: true,
                        subjectId: true,
                    },
                },
            },
        });

        if (!students.length) {
            return NextResponse.json(new ApiError(404, "No students found for the given teacher"));
        }

        // ✅ Step 4: Count how many times attendance has been scheduled for each student
        const attendanceCount = await prisma.attendance.groupBy({
            by: ["studentId", "subjectId"],
            _count: {
                id: true,
            },
        });

        // ✅ Step 5: Grouping attendance by batch, subject, and student
        const attendanceSummary: Record<string, any> = {};

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

                // ✅ Find the student's attendance count for the subject
                const studentAttendanceCount = attendanceCount.find(
                    (count) =>
                        count.studentId === student.id &&
                        count.subjectId === enrollment.subject.id
                );

                const totalSchedules = studentAttendanceCount?._count?.id || 0;

                // ✅ Determine attendance status
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

                // ✅ Push student data
                attendanceSummary[key].students.push({
                    id: student.id,
                    name: `${student.Firstname} ${student.lastname}`,
                    rollNumber: student.rollNumber,
                    email: student.email,
                    status,
                    totalAttendanceScheduled: totalSchedules,
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
        return NextResponse.json(new ApiError(500, "Something went wrong", error));
    }
}

