// Ensure you have a Prisma client instance

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";
const prisma = new PrismaClient()
export async function POST(req: NextRequest, res: NextResponse) {

  const teacherId = new URL(req.url).searchParams.get("id");
  if (!teacherId || !ObjectId.isValid(teacherId)) {
    return NextResponse.json(new ApiError(400, "Invalid input", "Invalid input"));
  }
  try {
    const { subjectId, startTime, endTime, sessionId, year, batchId }: any = await req.json();

    // Validate input
    if (![subjectId, teacherId, startTime, endTime, sessionId, year, batchId].every((e) => e)) {
      return NextResponse.json(new ApiError(400, "Invalid input", "Invalid input"));
    }

    // Check if teacher is assigned to the subject
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        teacher: {
          where: { id: teacherId },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(new ApiError(403, "Teacher not assigned to subject", "Teacher not assigned to subject"));
    }

    // Create schedule
    const schedule = await prisma.scheduleAttendance.create({
      data: {
        subjects: { connect: { id: subjectId } },
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(new ApiResponse({ status: 200, data: schedule }));
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Internal server error", error));
  }
}

