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
}

export async function POST(req: NextRequest) {
    const teacherId = new URL(req.url).searchParams.get("id");

    if (!teacherId || !ObjectId.isValid(teacherId)) {
        return NextResponse.json(new ApiError(400, "Invalid input", "Invalid teacher ID"));
    }

    try {
        const { subjectId, startTime, endTime,batchId }: ScheduleAttendance = await req.json();
        console.log("Request body:", { subjectId, startTime, endTime ,batchId});

        if (![subjectId, teacherId, startTime, endTime].every(Boolean)) {
            return NextResponse.json(new ApiError(400, "Invalid input", "Missing required details"));
        }

        // Check if the teacher is assigned to the subject.
        const teacherSubject = await prisma.teacherSubject.findFirst({
            where: {
                teacherId,
                subjectId,
                // branchId,
            },
        });

        if (!teacherSubject) {
            return NextResponse.json(new ApiError(403, "Teacher not assigned to subject", "Teacher not assigned to subject"));
        }

        // Create a new schedule attendance and link it to TeacherSubject.
        const schedule = await prisma.scheduleAttendance.create({
            data: {
                startTime: new Date(startTime),
                endTime: new Date(endTime),

                TeacherSubject: { connect: { id: teacherSubject.id } }, // Link without overwriting
                batch: { connect: { id: batchId }}
           
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
