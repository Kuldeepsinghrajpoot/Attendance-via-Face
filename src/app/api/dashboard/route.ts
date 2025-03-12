import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const dateParam = req.nextUrl.searchParams.get("date");

    if (!id) {
      return NextResponse.json(
        new ApiResponse({ status: 400, data: "Invalid request: Missing ID" })
      );
    }

    // Validate and parse date, defaulting to today if not provided.
    const date = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        new ApiResponse({ status: 400, data: "Invalid date format" })
      );
    }

    // Fetching data for a single **day**, not the whole month.
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Fetch schedules for the given day
    const schedules = await prisma.scheduleAttendance.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        Subject: { select: { id: true, subjectName: true } },
        batch: { select: { id: true, batch: true } },
        branch: { select: { id: true, branchName: true } },
      },
    });

    // Fetch attendance records for the given day
    const attendances = await prisma.attendance.findMany({
      where: {
        scheduleAttendance: {
          startTime: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      select: {
        id: true,
        subject: { select: { id: true, subjectName: true } },
        scheduleAttendance: {
          select: {
            Subject: { select: { subjectName: true } },
            startTime: true,
            endTime: true,
            Role: { select: { firstName: true, role: true, email: true } },
            batch: { select: { batch: true } },
          },
        },
        student: {
          select: {
            Firstname: true,
            role: true,
            batch: { select: { batch: true } },
            branch: { select: { branchName: true } },
            rollNumber: true,
          },
        },
        status: true,
      },
    });

    // Fetch attendance summary for the given day
    const attendanceRecord = await getAttendanceSummary(startDate, id);
    // If no data found, return 404
    if (schedules.length === 0 && attendances.length === 0) {
      return NextResponse.json(
        new ApiResponse({ status: 404, data: "No attendance records found" })
      );
    }

    // Return successful response
    return NextResponse.json(
      new ApiResponse({
        status: 200,
        data: { schedules, attendances, attendanceRecord },
      })
    );
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      new ApiResponse({ status: 500, data: "Internal server error" })
    );
  }
}

// 🔹 Fetch attendance summary for a specific day
const getAttendanceSummary = async (date: Date, id: any) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      scheduleAttendance: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },

        Role: {
          some: {
            id, // Filter by teacher ID
          }
        },
      },
    },
    include: {
      subject: true,
      scheduleAttendance: { include: { Subject: true, batch: true } },
      student: {
        select: {
          Firstname: true,
          role: true,
          batch: { select: { batch: true } },
          rollNumber: true,
        },
      },
    },
  });

  // Group attendance by subject and batch
  const summary: Record<string, Record<string, { total: number; present: number; absent: number }>> = {};

  attendanceRecords.forEach((record) => {
    const subjectName = record.subject.subjectName;
    const batchName = record.student.batch.batch;

    if (!summary[subjectName]) {
      summary[subjectName] = {};
    }
    if (!summary[subjectName][batchName]) {
      summary[subjectName][batchName] = { total: 0, present: 0, absent: 0 };
    }

    summary[subjectName][batchName].total++;
    if (record.status === "PRESENT") {
      summary[subjectName][batchName].present++;
    } else {
      summary[subjectName][batchName].absent++;
    }
  });

  return summary;
};
