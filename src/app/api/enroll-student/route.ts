import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";
import { ObjectId } from "bson";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  // Get the teacher id from the URL query parameters.
  const teacherId = req.nextUrl.searchParams.get("id") ?? "";
  if (!teacherId && !ObjectId.isValid(teacherId)) {
    return NextResponse.json(
      new ApiError(401, "User not authorized", "User not authorized")
    );
  }
  // console.log("teacherId by browser", teacherId);

  // console.log("subjectId", await req.json());
  const { values } = await req.json();
  const { subjectId, session, year, batchId, branchId } = await values;
  // console.log("values", values);
  if (![subjectId, session, year, batchId, branchId].every((e) => !!e)) {
    return NextResponse.json(
      new ApiError(400, "Invalid details", "Invalid details")
    );
  }

  try {
    // Step 1: Retrieve the subject.
    // console.log("subjectId", subjectId);
    const subject = await prisma.subject.findMany({
      where: { id: subjectId },
    });
    if (!subject) {
      return NextResponse.json(
        new ApiError(404, "Subject not found", "Subject not found")
      );
    }

    // Step 2: Ensure TeacherSubject record exists.
    let teacherSubject = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: teacherId,
        subjectId: subjectId,
      },
    });

    if (!teacherSubject) {
      // If not found, create it.
      teacherSubject = await prisma.teacherSubject.create({
        data: {
          teacher: { connect: { id: teacherId } },
          subject: { connect: { id: subjectId } },
          // scheduleAttendance: { connect: { id: "someScheduleAttendanceId" } }, // Replace with actual scheduleAttendanceId
          branch: { connect: { id: branchId } }, // Add the branch connection
        },
      });
    }

    // Step 3: Fetch students from the specified batch and branch.
    const students = await prisma.student.findMany({
      where: {
        batchId,
        branchId,
      },
      select: { id: true, batchId: true },
    });

    if (students.length === 0) {
      return NextResponse.json(
        new ApiError(404, "No students found", "No students found")
      );
    }

    // Step 4: Check for already enrolled students for the subject.
    const studentIds = students.map((student) => student.id);
    const existingEnrollments = await prisma.enroll.findMany({
      where: {
        subjectId,
        studentId: { in: studentIds },
      },
      select: { studentId: true },
    });

    // Create a set of student IDs that are already enrolled.
    const enrolledStudentIds = new Set(
      existingEnrollments.map((enroll) => enroll.studentId)
    );

    // Filter out students who are already enrolled in the subject.
    const studentsToEnroll = students.filter(
      (student) => !enrolledStudentIds.has(student.id)
    );

    if (studentsToEnroll.length === 0) {
      return NextResponse.json(
        new ApiError(
          409,
          "All students are already enrolled in this subject",
          "All students are already enrolled"
        )
      );
    }

    // Step 5: Create enrollments for each student not already enrolled.
    const enrollments = await prisma.enroll.createMany({
      data: studentsToEnroll.map((student) => ({
        studentId: student.id,
        subjectId,
        batchId: student.batchId!,
        session,
        year,
        teacherSubjectId: teacherSubject.id,
      })),
    });

    if (enrollments.count > 0) {
      return NextResponse.json(
        new ApiResponse({
          status: 200,
          data: {
            createdEnrollments: enrollments.count,
            skippedStudents:
              studentIds.length - studentsToEnroll.length,
          },
          message: "Enrolled students successfully",
        })
      );
    }

    return NextResponse.json(
      new ApiError(
        404,
        "No enrollments created",
        "No enrollments created"
      )
    );
  } catch (error) {
    console.error("Error enrolling students:", error);
    return NextResponse.json(new ApiError(500, "Internal Server Error"));
  } finally {
    await prisma.$disconnect();
  }
}
export async function GET(req: NextRequest): Promise<Response> {
  // Retrieve the teacherId from query parameters.
  const teacherId = req.nextUrl.searchParams.get("id") ?? "";
  if (!teacherId) {
    return NextResponse.json(
      new ApiError(
        401,
        "Teacher ID is required",
        "Teacher ID is required"
      )
    );
  }

  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch enrollments for the given teacher via the teacherSubject relation.
    // Include subject, batch, session, year and the attendance schedule from teacherSubject.
    const enrollments = await prisma.enroll.findMany({
      where: {
        teacherSubject: { teacherId },
      },
      select: {
        session: true,
        year: true,
        subject: {
          select: {
            id: true,
            subjectName: true,
          },
        },
        batch: {
          select: {
            id: true,
            batch: true,
          },
        },
        teacherSubject: {
          select: {
            scheduleAttendance: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
    });

    if (enrollments.length === 0) {
      return NextResponse.json(
        new ApiError(
          404,
          "No enrollments found for the given teacher",
          "No enrollments found"
        )
      );
    }

    // Group enrollments by subject, session, year, and batch.
    // Also, include the attendance schedule from teacherSubject if its startTime is today.
    const groups = new Map<
      string,
      {
        subject: { id: string; subjectName: string };
        session: string;
        year: string;
        batch: { id: string; batch: string };
        studentCount: number;
        scheduleAttendance: {
          id: string;
          startTime: Date | null;
          endTime: Date | null;
        } | null;
      }
    >();

    enrollments.forEach((enroll) => {
      // Create a unique key for grouping.
      const key = `${enroll.subject.id}-${enroll.session}-${enroll.year}-${enroll.batch.id}`;

      // Get the schedule attendance from teacherSubject.
      let validSchedule =
        enroll?.teacherSubject?.scheduleAttendance ?? null;
      if (validSchedule && validSchedule.startTime) {
        // Check if the schedule's startTime is today.
        const scheduleStart = new Date(validSchedule.startTime);
        scheduleStart.setHours(0, 0, 0, 0);
        if (scheduleStart.getTime() !== today.getTime()) {
          validSchedule = null;
        }
      }

      if (groups.has(key)) {
        groups.get(key)!.studentCount += 1;
      } else {
        groups.set(key, {
          subject: enroll.subject,
          session: enroll.session,
          year: enroll.year,
          batch: enroll.batch,
          studentCount: 1,
          scheduleAttendance: validSchedule,
        });
      }
    });

    const result = Array.from(groups.values());

    return NextResponse.json(
      new ApiResponse({
        status: 200,
        data: result,
        message:
          "Subjects with session, year, batch, student count and today’s attendance schedule retrieved successfully",
      })
    );
  } catch (error) {
    console.error("Error retrieving enrollments:", error);
    return NextResponse.json(new ApiError(500, "Internal Server Error"));
  } finally {
    await prisma.$disconnect();
  }
}
