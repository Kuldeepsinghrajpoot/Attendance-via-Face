import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";
import { ObjectId } from "mongodb"; // Import ObjectId to validate id

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(new ApiError(403, "id not found"));
    }

    try {
        // Ensure ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(new ApiError(400, "Invalid student ID"));
        }

        const student = await prisma.student.findUnique({
            where: { id },
            include: {
              Enroll: {
                select: {
                  id: true,
                  session: true,
                  year: true,
                  batch: {
                    select: { id: true, batch: true },
                  },
                  subject: {
                    select: {
                      id: true,
                      subjectName: true,
                    //   branch: { select: { id: true, branchName: true } },
                    //   teacher: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
                    },
                  },
                  // Include the teacherSubject relation to get the schedule attendance
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
              },
              Attendance: {
                select: {
                  id: true,
                  status: true,
                  createdAt: true,
                  subjectId: true,
                //   scheduleId: true,
                },
              },
            },
          });
          

        if (!student) {
            return NextResponse.json(new ApiError(404, "Student not found"));
        }

        // Remove duplicates from Enroll and Attendance using reduce-based approach
        const uniqueEnrolls = Object.values(
            student.Enroll.reduce((acc: Record<string, any>, enroll: any) => {
                acc[enroll.id] = enroll;
                return acc;
            }, {})
        );
        const uniqueAttendance = Object.values(
            student.Attendance.reduce((acc: Record<string, any>, att: any) => {
                acc[att.id] = att;
                return acc;
            }, {})
        );

        // Verify which enrollment has attendance marked.
        // For each enrollment, check if there is a matching attendance record using subjectId and (if available) scheduleId.
        const updatedEnrolls = uniqueEnrolls.map((enroll: any) => {
            const subjectId = enroll.subject.id;
            // Get the scheduleId from the subject's ScheduleAttendance, if exists.
            const scheduleId = enroll.subject.ScheduleAttendance?.id;
            // Look for an attendance record that matches the subject, and if scheduleId is provided, match that too.
            const attendanceRecord = uniqueAttendance.find((att: any) => {
                return (
                    att.subjectId === subjectId &&
                    (scheduleId ? att.scheduleId === scheduleId : true)
                );
            });
            return {
                ...enroll,
                attendanceStatus: attendanceRecord ? "PRESENT" : null,
            };
        });

        const cleanedStudent = {
            ...student,
            Enroll: updatedEnrolls,
            Attendance: uniqueAttendance,
        };

        return NextResponse.json(
            new ApiResponse({ status: 200, data: cleanedStudent })
        );
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            new ApiError(500, "Something went wrong", error)
        );
    }
}
