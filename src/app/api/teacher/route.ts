import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
    try {
      // teacher id by the get request
      const id = new URL(req.url).searchParams.get("id");
  
      if (!id) {
        return NextResponse.json(
          new ApiError(403, "You are not authorized")
        );
      }
  
      const [getUser, teacherCount, adminCount] = await Promise.all([
        prisma.roles.findMany({
          where: {
            id: id,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
            // Include subjects taught by the teacher.
            subjects: {
              select: {
                id: true,
                subjectName: true,
                // If your Subject model has a relation to Branch, include it.
                branch: {
                  select: {
                    id: true,
                    branchName: true,
                  },
                },
                // Optionally, include scheduleAttendance or other nested relations.
              },
            },
            // If you have an enrollments relation in Roles, you can include that
            Enroll: {
              select: {
                id: true,
                session: true,
                year: true,
                // Include the Batch related to the enrollment.
                batch: {
                  select: {
                    id: true,
                    batch: true,
                  },
                },
                // Also include subject details from the enrollment if needed.
                subject: {
                  select: {
                    id: true,
                    subjectName: true,
                  },
                },
                // And you can include the student details from the enrollment.
                student: {
                  select: {
                    id: true,
                    Firstname: true,
                    lastname: true,
                    email: true,
                  },
                },
              },
            },
          },
        }),
        prisma.roles.count({
          where: { role: "TEACHER" },
        }),
        prisma.roles.count({
          where: { role: "ADMIN" },
        }),
      ]);
  
      return NextResponse.json(
        new ApiResponse({
          status: 200,
          data: { getUser, teacherCount, adminCount },
          message: "Fetched successfully",
        })
      );
    } catch (error) {
      return NextResponse.json(new ApiError(401, "Unauthorized user", error));
    } finally {
      await prisma.$disconnect();
    }
  }
  