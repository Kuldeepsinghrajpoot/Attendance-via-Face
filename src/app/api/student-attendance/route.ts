import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson"; // Import ObjectId to validate id

const prisma = new PrismaClient();

// Helper: Format a date-time string into a day (DD/MM/YYYY) and time (HH:MM:SS)

export async function GET(req: NextRequest): Promise<Response> {
  const id = req?.nextUrl?.searchParams?.get("id");
  if (!id) {
    return NextResponse.json(new ApiError(403, "id not found"));
  }

  try {
    // Ensure ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(new ApiError(400, "Invalid student ID"));
    }

    // Get today's start and end time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        Firstname: true,
        lastname: true,
        avatar: true,
        rollNumber: true,
        batchId: true,
        role: true,
        Enroll: {
          select: {
            id: true,
            session: true,
            year: true,
            batch: { select: { id: true, batch: true } },
            subject: { select: { id: true, subjectName: true } },
            teacherSubject: {
              select: {
                scheduleAttendance: {
                  where: {
                    startTime: {
                      gte: today, // Greater than or equal to today's start
                      lt: tomorrow, // Less than tomorrow (ensuring only today's data)
                    },
                  },
                  select: {
                    id: true,
                    startTime: true,
                    endTime: true,
                  },
                },
              },
            },
          },
        },
        Attendance: {
          where: {
            createdAt: {
              gte: today, // Attendance created today
              lt: tomorrow,
            },
          },

          select: {
            id: true,
            status: true,
            createdAt: true,
            subjectId: true,
            subject: { select: { id: true, subjectName: true } },
            // schedule:{}
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(new ApiError(404, "Student not found"));
    }

    return NextResponse.json(new ApiResponse({ status: 200, data: student }));
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(new ApiError(500, "Something went wrong", error));
  }
}

