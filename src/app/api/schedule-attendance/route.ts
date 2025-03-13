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

        if (![subjectId, teacherId, startTime, endTime, batchId].every(Boolean)) {
            return NextResponse.json(new ApiError(400, "Invalid input", "Missing required details"));
        }

        // Check if the teacher is assigned to the subject
        const teacherSubject = await prisma.teacherSubject.findFirst({
            where: {
                teacherId: teacherId,
                subjectId: subjectId
            },
            select: { id: true }
        });

        if (!teacherSubject) {
            return NextResponse.json(new ApiError(403, "Teacher not assigned to subject", "Teacher is not assigned to this subject"));
        }

        // Check if attendance is already scheduled for the same day
        const existingSchedule = await prisma.scheduleAttendance.findFirst({
            where: {
                teacherSubjectId: teacherSubject.id,
                batchId: batchId,
                subjectId: subjectId,
                startTime: {
                    gte: new Date(new Date(startTime).setHours(0, 0, 0, 0)),
                    lte: new Date(new Date(startTime).setHours(23, 59, 59, 999))
                }
            }
        });

        if (existingSchedule) {
            // If schedule exists, update only endTime
            const updatedSchedule = await prisma.scheduleAttendance.update({
                where: { id: existingSchedule.id },
                data: { endTime: new Date(endTime) }
            });
            return NextResponse.json(new ApiResponse({ status: 200, data: updatedSchedule }));
        }

        // Retrieve students from the batch
        const students = await prisma.student.findMany({
            where: { batchId },
            select: { id: true },
        });

        if (!students.length) {
            return NextResponse.json(new ApiError(404, "No students found", "No students found in this batch"));
        }

        // Create new schedule attendance with student records
        const newSchedule = await prisma.scheduleAttendance.create({
            data: {
                teacherId,
                batchId,
                subjectId,
                teacherSubjectId: teacherId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                batch: { connect: { id: batchId } },
                Subject: { connect: { id: subjectId } },
                Role: { connect: { id: teacherId } },
                TeacherSubject: { connect: { id: teacherSubject.id } },
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

        return NextResponse.json(new ApiResponse({ status: 200, data: newSchedule }));

    } catch (error) {
        console.error("Error creating schedule:", error);
        return NextResponse.json(new ApiError(500, "Internal server error", error));
    } finally {
        await prisma.$disconnect();
    }
}
