import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../../api-error";
import { ApiResponse } from "../../api-response";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: any }> }) {
  try {
    const userId = new URL(req.url).searchParams.get("id");
    if (!userId) {
      return NextResponse.json(new ApiError(403, "You are not authorized"));
    }

    const { id } = await params;
    const [subject, session, year, batch] = id.join('-').split("-");

    console.log({ subject, session, year, batch });

    const getUser = await prisma.roles.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        
        Enroll: {
          where: {
            session: session || undefined,
            year: year || undefined,
            batch: {
              id:batch
            },
          },
          select: {
            id: true,
            session: true,
            year: true,
            batch: {
              select: { id: true, batch: true },
            },
            subject: {
              select: { id: true, subjectName: true },
            },
          
          },
        },
      },
    });

    if (!getUser) {
      return NextResponse.json(new ApiError(404, "User not found"));
    }

    return NextResponse.json(
      new ApiResponse({
        status: 200,
        data: {
          user: getUser,
          subject,
          session,
          year,
          batch,
        },
        message: "Student info retrieved successfully",
      })
    );
  } catch (error) {
    return NextResponse.json(
      new ApiError(500, "Internal Server Error", error instanceof Error ? error.message : "Unknown error")
    );
  }
}