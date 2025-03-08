import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const teacherId = new URL(req.url).searchParams.get("id");

    if (!teacherId || !ObjectId.isValid(teacherId)) {
        return NextResponse.json(
            new ApiError(400, "Invalid input", "Invalid input")
        );
    }

    try {
        const { subjectId, startTime, endTime }: any = await req.json();

        // Validate input – you can add more validations if needed.
        if (![subjectId, teacherId, startTime, endTime].every((e) => e)) {
            return NextResponse.json(
                new ApiError(400, "Invalid input", "Details Invalid input")
            );
        }

        // Check if the teacher is assigned to the subject.
        // We look in the teacherSubject table for a record where teacherId and subjectId match.
        const teacherSubject = await prisma.teacherSubject.findFirst({
            where: {
                teacherId,
                subjectId,
            },
        });

        console.log("TeacherSubject record:", teacherSubject);
        if (!teacherSubject) {
            return NextResponse.json(
                new ApiError(
                    403,
                    "Teacher not assigned to subject",
                    "Teacher not assigned to subject"
                )
            );
        }

        // After creating the schedule attendance record:
        const schedule = await prisma.scheduleAttendance.create({
            data: {
                startTime: new Date(startTime),
                endTime: new Date(endTime),
            },
        });

        // Update the teacherSubject record (instead of subject) to reference this schedule attendance.
        await prisma.teacherSubject.update({
            where: { id: teacherSubject.id },
            data: { scheduleAttendanceId: schedule.id },
        });

        return NextResponse.json(
            new ApiResponse({ status: 200, data: schedule })
        );
    } catch (error) {
        console.error("Error creating schedule:", error);
        return NextResponse.json(
            new ApiError(500, "Internal server error", error)
        );
    } finally {
        await prisma.$disconnect();
    }
}
