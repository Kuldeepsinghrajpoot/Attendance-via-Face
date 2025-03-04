// Ensure you have a Prisma client instance

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient()
export  async function POST(req: NextRequest, res: NextResponse) {

    const teacherId = new URL(req.url).searchParams.get("id");
    if (!teacherId) {
      return NextResponse.json(new ApiError(400, "Invalid input","Invalid input"));
    }
    try {
      const { subjectId, fromTo, upTo }:any = await req.json();

      // Validate input
      if (!subjectId || !teacherId || !fromTo || !upTo) {
        return NextResponse.json(new ApiError(400, "Invalid input","Invalid input"));
      }

      // Check if teacher is assigned to the subject
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: { 
            role: {
                where: { id: teacherId },
            },
         },
      });

      if (!subject) {
        return NextResponse.json(new ApiError(403, "Teacher not assigned to subject","Teacher not assigned to subject"));
      }

      // Create schedule
      const schedule = await prisma.scheduleAttendance.create({
        data: {
          subjects: { connect: { id: subjectId } },
          fromTo: new Date(fromTo),
          upTo: new Date(upTo),
        },
      });

      return NextResponse.json(new ApiResponse({ status: 200, data: schedule }));
    } catch (error) {
      return NextResponse.json(new ApiError(500, "Internal server error", error));
    }
  }

