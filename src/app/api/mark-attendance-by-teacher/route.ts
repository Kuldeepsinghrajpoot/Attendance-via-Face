import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { Attendance, PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

// ✅ Function to check if attendance is already marked for the student today
async function getAttendanceForDate(
    studentId: string,
    subjectId: string,
    date: Date
): Promise<Attendance | null> {
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
        if (!id)
            return NextResponse.json(
                new ApiError(400, "Bad Request", "ID not provided")
            );

        // ✅ Extract request body
        const { avatar, subjectId, id: studentId, role } = await req.json();
        if (!avatar || !subjectId || !studentId)
            return NextResponse.json(
                new ApiError(400, "Bad Request", "Missing required parameters")
            );

        // ✅ If role is "teacher", do not mark attendance
        if (role === "TEACHER") {
            // return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Teachers do not need to mark attendance" }));
            // ✅ Find student by avatar and ID
            const user = await prisma.student.findFirst({
                where: { avatar: `${avatar}.jpeg`, id: studentId },
                select: {
                    id: true,
                    Firstname: true,
                    lastname: true,
                    rollNumber: true,
                    batchId: true,
                    role: true,
                    phone: true,
                    branchId: true,
                },
            });

            if (!user)
                return NextResponse.json(
                    new ApiError(404, "Not Found", "Student not found")
                );

            // ✅ Check if the student already marked attendance today
            const attendanceForToday = await getAttendanceForDate(
                user.id,
                subjectId,
                new Date()
            );
            if (attendanceForToday) {
                return NextResponse.json(
                    new ApiResponse({
                        status: 200,
                        data: {},
                        message: "Attendance already marked",
                    })
                );
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
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: {},
                    message: "Attendance marked successfully",
                })
            );
        }

        return NextResponse.json(
            new ApiError(
                403,
                "Forbidden",
                "Only teachers can mark student attendance"
            )
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            new ApiError(
                500,
                "Internal Server Error",
                "Failed to mark attendance"
            )
        );
    }
}

export async function GET(req: NextRequest): Promise<Response> {
    try {
        // Get teacher id from query string and validate it
        const teacherId = req?.nextUrl?.searchParams?.get("id");
        if (!teacherId || !ObjectId.isValid(teacherId)) {
            return NextResponse.json(
                new ApiError(400, "Invalid or missing teacherId")
            );
        }

        // Step 1: Find teacher assigned subjects and batches
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
        const batchIds = teacherSubjects
            .map((ts) => ts.BatchId)
            .filter((id) => id !== null);
        const subjectIds = teacherSubjects.map((ts) => ts.subjectId);

        // Step 2: Fetch students for those batches along with enrollment info
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
            },
        });
        if (!students.length) {
            return NextResponse.json(
                new ApiError(404, "No students found for the given teacher")
            );
        }

        // Step 3: Get overall attendance counts for each student per subject.
        // Here we assume attendance records have status "PRESENT" and "ABSENT".
        // Adjust the filters if you use different status values.
        const presentCounts = await prisma.attendance.groupBy({
            by: ["studentId", "subjectId"],
            where: {
                status: "PRESENT",
                subjectId: { in: subjectIds },
            },
            _count: { id: true },
        });

        const absentCounts = await prisma.attendance.groupBy({
            by: ["studentId", "subjectId"],
            where: {
                status: "NOT_MARKED",
                subjectId: { in: subjectIds },
            },
            _count: { id: true },
        });

        // Step 4: Build a summary grouped by subject for each student.
        // The key is a combination of batch, branch, and subject.
        const attendanceSummary: Record<string, any> = {};

        students.forEach((student) => {
            // For each enrollment record (each subject the student is enrolled in)
            student.Enroll.forEach((enrollment) => {
                const key = `${enrollment.batch.batch}-${student.branch.branchName}-${enrollment.subject.subjectName}`;
                if (!attendanceSummary[key]) {
                    attendanceSummary[key] = {
                        batch: enrollment.batch.batch,
                        branch: student.branch.branchName,
                        subject: enrollment.subject.subjectName,
                        subjectId: enrollment.subject.id,
                        students: [],
                    };
                }

                // Get the count of present and absent records for this student in this subject
                const presentRecord = presentCounts.find(
                    (record) =>
                        record.studentId === student.id &&
                        record.subjectId === enrollment.subject.id
                );
                const absentRecord = absentCounts.find(
                    (record) =>
                        record.studentId === student.id &&
                        record.subjectId === enrollment.subject.id
                );

                const totalPresent = presentRecord?._count?.id || 0;
                const totalAbsent = absentRecord?._count?.id || 0;

                attendanceSummary[key].students.push({
                    id: student.id,
                    name: `${student.Firstname} ${student.lastname}`,
                    rollNumber: student.rollNumber,
                    email: student.email,
                    totalPresent,
                    totalAbsent,
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