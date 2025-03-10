import { Attendance, PrismaClient, Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";

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
      subjectId,
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
    // console.log("Avatar:", avatar, subjectId, scheduleId);
    if ([avatar, subjectId, scheduleId].some((param) => !param)) {
      return NextResponse.json(new ApiError(400, "Bad Request", "Missing required parameters"));
    }
    if (!scheduleId || scheduleId.trim().length === 0) {
      return NextResponse.json(new ApiError(400, "Bad Request", "Subject ID not provided"));
    }
    if (!avatar && avatar.trim().length === 0) {
      return new Response(
        JSON.stringify({ status: 400, error: "Avatar not provided" }),
        { status: 400 }
      );
    }

    const user = await prisma.student.findFirst({
      where: {
        avatar: `${avatar}.jpeg`,
        id,
      },
      select: {
        id: true,
        email: true,
        Firstname: true,
        lastname: true,
        avatar: true,
        rollNumber: true,
        batchId: true,
        role: true,
        phone: true,
        branchId: true,
      }
    });

    if (!user) {
      return NextResponse.json(new ApiError(404, "Not Found", "Student not found"));
    }

    // Check if schedule exists and is still valid
    if (scheduleId && scheduleId.trim().length !== 0) {
      const schedule = await prisma.scheduleAttendance.findUnique({
        where: { id: scheduleId },
        select: { startTime: true, endTime: true },
      });

      if (!schedule) {
        return new Response(
          JSON.stringify({ status: 400, error: "Schedule does not exist. Attendance cannot be marked." }),
          { status: 400 }
        );
      }

      const now = new Date();
      const scheduleStart = new Date(schedule?.startTime ?? "");
      const scheduleEnd = new Date(schedule?.endTime ?? "");

      if (now < scheduleStart || now > scheduleEnd) {
        return NextResponse.json(new ApiError(400, "Bad Request", "Schedule is not active. Attendance cannot be marked."));
       
      }
    }

    // Check if the student has already been marked for this subject today.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceForToday = await getAttendanceForDate(user.id, subjectId, today);

    if (attendanceForToday) {
      return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Attendance already marked" }));
    }

    // Mark attendance with default status "PRESENT"
    await prisma.attendance.create({
      data: {
        student: { connect: { id: user.id } },
        subject: { connect: { id: subjectId } },
        status: "PRESENT",

        ...(scheduleId && { scheduleAttendance: { connect: { id: scheduleId } } }),
      },
    });

    return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Attendance marked successfully" }));
  } catch (error) {
    // console.error("Error:", error);
    return NextResponse.json(new ApiError(500, "Internal Server Error", "Failed to mark attendance"));
  }
}


export async function GET(req: NextRequest): Promise<Response> {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  try {
    const response = await prisma.student.findMany({

      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        Firstname: true,
        lastname: true,
        avatar: true,
        rollNumber: true,
        batchId: true,
        role: true,
        phone: true,
        branchId: true,
        Attendance: {
          where: {
            status: "PRESENT",
            createdAt: {
              gte: currentDate,
            },
          },
          orderBy: { createdAt: "desc" },
        },
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
      new ApiError(500, "Internal Server Error", " Failed to fetch data")
    );
  }
}
