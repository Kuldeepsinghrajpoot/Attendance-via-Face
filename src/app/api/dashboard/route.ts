import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<Response> {
    // Retrieve the student id from query parameters.
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
        return NextResponse.json(new ApiError(403, "id not found"));
    }

    try {
        // Validate the student id
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(new ApiError(400, "Invalid student ID"));
        }

        // Fetch the student with related enrollments (including subject and batch details)
        const student = await prisma.student.findUnique({
            where: { id },
            select: {
                Enroll: {
                    select: {
                        id: true,
                        session: true,
                        year: true,
                        batch: { select: { id: true, batch: true } },
                        subject: {
                            select: {
                                id: true,
                                subjectName: true,
                                branchId: true,
                            },
                        },
                        teacherSubject: {
                            select: {
                                scheduleAttendance: {
                                    select: {
                                        id: true,
                                        startTime: true,
                                        endTime: true,
                                        Attendance: {
                                            select: {
                                                id: true,
                                                status: true,
                                                createdAt: true,
                                                subjectId: true,
                                                scheduleId: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            return NextResponse.json(new ApiError(404, "Student not found"));
        }

        // Extract filter parameters from the student's first enrollment.
        // (You can extend this to loop over multiple enrollments if needed.)
        if (!student.Enroll || student.Enroll.length === 0) {
            return NextResponse.json(
                new ApiError(404, "No enrollment records found for the student")
            );
        }

        const enrollment = student.Enroll[0];
        const subjectId = enrollment.subject.id;
        const branchId = enrollment.subject.branchId;
        const batchId = enrollment.batch.id;

        // Fetch schedule attendance records with their related TeacherSubject and Subject details.
        const scheduleAttendance = await prisma.scheduleAttendance.findMany({
            include: {
                TeacherSubject: {
                    select: {
                        id: true,
                        teacherId: true,
                        subject: { select: { id: true, subjectName: true } },
                    },
                },
                Subject: {
                    select: { id: true, subjectName: true, branchId: true },
                },
                Attendance: true,
            },
        });

        // Count the number of schedule records for the subject (and branch)
        const scheduleCount = await prisma.scheduleAttendance.count({
            where: {
                Subject: {
                    some: {
                        id: subjectId,
                        branchId: branchId ?? undefined,
                    },
                },
            },
        });

        // Count the number of attendance records with status PRESENT
        // for that subject in the given branch and batch.
        const presentCount = await prisma.attendance.count({
            where: {
                subjectId: subjectId,
                status: "PRESENT",
            },
        });
        const subjectIds = "67c56ae5cff552bd41006337"; // Example subject id for C++

        const presentStudents = await prisma.attendance.findMany({
            where: {
                subjectId: subjectIds,
                status: "PRESENT",
            },
            include: {
                student: true, // Include student details if needed
            },
        });
        const scheduleAttendances = await prisma.scheduleAttendance.findMany({
            where: {
                Subject: {
                    some: {
                        subjectName: "c++",
                    },
                },
            },
            include: {
                TeacherSubject: {
                    select: {
                        id: true,
                        teacherId: true,
                        subject: { select: { id: true, subjectName: true } },
                    },
                },
                Subject: true,
                Attendance: true,
            },
        });

        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: {
                    student,
                    scheduleAttendance,
                    scheduleCount,
                    presentCount,
                    presentStudents,
                    scheduleAttendances,
                },
                message:
                    "Student data retrieved successfully along with schedule and attendance counts",
            })
        );
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            new ApiError(500, "Something went wrong", error)
        );
    } finally {
        await prisma.$disconnect();
    }
}
