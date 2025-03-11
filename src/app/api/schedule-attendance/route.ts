import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

interface ScheduleAttendance {
    startTime: Date;
    endTime: Date;
    subjectId: string;
    batchId: string;
    branchId: string;
}

export async function POST(req: NextRequest) {
    const teacherId = new URL(req.url).searchParams.get("id");

    if (!teacherId || !ObjectId.isValid(teacherId)) {
        return NextResponse.json(new ApiError(400, "Invalid input", "Invalid teacher ID"));
    }

    try {
        const { subjectId, startTime, endTime, batchId }: ScheduleAttendance = await req.json();
        // console.log("Request body:", { subjectId, startTime, endTime, batchId, branchId });

        if (![subjectId, teacherId, startTime, endTime, batchId].every(Boolean)) {
            return NextResponse.json(new ApiError(400, "Invalid input", "Missing required details"));
        }

        // Check if the teacher is assigned to the subject
        const teacherSubject = await prisma.teacherSubject.findFirst({
            where: {
                teacherId: teacherId,
                subjectId: subjectId
            },
            select: {
                id: true
            }
        });
        // console.log(teacherSubject)
        if (!teacherSubject) {
            return NextResponse.json(new ApiError(403, "Teacher not assigned to subject", "Teacher is not assigned to this subject"));
        }

        // Retrieve students from the batch
        const students = await prisma.student.findMany({
            where: { batchId },
            select: { id: true },
        });

        if (!students.length) {
            return NextResponse.json(new ApiError(404, "No students found", "No students found in this batch"));
        }

        // Create schedule attendance with student attendance records
        const schedule = await prisma.scheduleAttendance.create({
            data: {
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                batch: { connect: { id: batchId } },
                Subject: { connect: { id: subjectId } },
                Role: {
                    connect: {
                        id: teacherId
                    }
                },
                // branch: { connect: { id: branchId } },
                TeacherSubject: { connect: { id: teacherSubject.id } }, // Connect teacher to schedule
                Attendance: {
                    create: students.map(student => ({
                        status: "NOT_MARKED",
                        student: { connect: { id: student.id } },
                        subject: { connect: { id: subjectId } },
                        batch: { connect: { id: batchId } },
                    })),
                },
            },
        });

        return NextResponse.json(new ApiResponse({ status: 200, data: schedule }));
    } catch (error) {
        console.error("Error creating schedule:", error);
        return NextResponse.json(new ApiError(500, "Internal server error", error));
    } finally {
        await prisma.$disconnect();
    }
}
