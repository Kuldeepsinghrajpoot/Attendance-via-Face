import { Attendance, PrismaClient, Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

// Helper: Get attendance record for a student for a specific subject on a given date.
async function getAttendanceForDate(
  studentId: string,
  subjectId: string,
  date: Date
): Promise<Attendance | null> {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  const attendance = await prisma.attendance.findFirst({
    where: {
      studentId,
      subjectId, // Check that attendance record matches the subject
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });
  return attendance;
}

export async function POST(req: NextRequest): Promise<Response> {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(new ApiError(400, "Bad Request", "ID not provided"));
  }
  try {
    const { avatar, subjectId, scheduleId } = await req.json();
    if (!avatar) {
      return new Response(
        JSON.stringify({ status: 400, error: "Avatar not provided" }),
        { status: 400 }
      );
    }

    const user: Student | null = await prisma.student.findFirst({
      where: {
        avatar: `${avatar}.jpeg`,
        id,
      },
    });

    if (!user) {
      return NextResponse.json(new ApiError(404, "Not Found", "Student not found"));
    }

    // Check if the student has already been marked PRESENT for this subject today.
    const today = new Date();
    const attendanceForToday = await getAttendanceForDate(user.id, subjectId, today);
    if (attendanceForToday) {
      return new Response(
        JSON.stringify({ message: "Already PRESENT for this subject", id: user.id })
      );
    }

    // Create new attendance record for this subject.
    await prisma.attendance.create({
      data: {
        student: { connect: { id: user.id } },
        subject: { connect: { id: subjectId } },
        status: "PRESENT",
        ...(scheduleId && { scheduleAttendance: { connect: { id: scheduleId } } }),
      },
    });

    return new Response(
      JSON.stringify({ message: "Student marked Attendance successfully", id: user.id })
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ status: 500, error }), {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  try {
    const response = await prisma.student.findMany({
      include: {
        Attendance: {
          where: {
            status: "PRESENT",
            createdAt: {
              gte: currentDate,
              lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      where: {
        role: "STUDENT",
      },
    });
    return NextResponse.json(
      new ApiResponse({
        status: 200,
        data: response,
        message: "Fetched successfully",
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      new ApiError(500, "Internal Server Error", error)
    );
  }
}
