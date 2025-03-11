import { Attendance, PrismaClient, Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";

const prisma = new PrismaClient();

// Helper: Get attendance record for a student for a specific subject on a given date.
async function getAttendanceForDate(studentId: string, subjectId: string, date: Date): Promise<Attendance | null> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.attendance.findFirst({
    where: {
      studentId,
      subjectId,
      createdAt: { gte: startOfDay, lt: endOfDay },
      status: "PRESENT",
    },
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json(new ApiError(400, "Bad Request", "ID not provided"));

  try {
    const { avatar, subjectId, scheduleId } = await req.json();
    if (!avatar || !subjectId || !scheduleId)
      return NextResponse.json(new ApiError(400, "Bad Request", "Missing required parameters"));

    // ✅ Find student by avatar and ID
    const user = await prisma.student.findFirst({
      where: { avatar: `${avatar}.jpeg`, id },
      select: { id: true, email: true, Firstname: true, lastname: true, avatar: true, rollNumber: true, batchId: true, role: true, phone: true, branchId: true },
    });

    if (!user) return NextResponse.json(new ApiError(404, "Not Found", "Student not found"));

    // ✅ Get today's schedule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedule = await prisma.scheduleAttendance.findFirst({
      where: {
        id: scheduleId,
        startTime: { gte: today, lt: tomorrow }, // Ensure schedule is for today
      },
      select: { id: true, startTime: true, endTime: true },
    });

    if (!schedule) return NextResponse.json(new ApiError(400, "Bad Request", "No valid schedule for today"));

    // ✅ Check if attendance already marked
    const attendanceForToday = await getAttendanceForDate(user.id, subjectId, new Date());
    if (attendanceForToday)
      return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Attendance already marked" }));

    // ✅ Mark attendance for today's schedule
    await prisma.attendance.create({
      data: {
        studentId: user.id,
        subjectId,
        scheduleId: schedule.id,
        status: "PRESENT",
      },
    });

    return NextResponse.json(new ApiResponse({ status: 200, data: {}, message: "Attendance marked successfully" }));
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(new ApiError(500, "Internal Server Error", "Failed to mark attendance"));
  }
}
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const response = await prisma.student.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true, email: true, Firstname: true, lastname: true, avatar: true,
        rollNumber: true, batchId: true, role: true, phone: true, branchId: true,
        Attendance: {
          where: { status: "PRESENT", createdAt: { gte: currentDate } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json(new ApiResponse({ status: 200, data: response, message: "Fetched successfully" }));
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(new ApiError(500, "Internal Server Error", "Failed to fetch data"));
  }
}