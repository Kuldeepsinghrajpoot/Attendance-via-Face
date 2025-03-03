import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") ?? "";
    if (!id) {
        return NextResponse.json(new ApiError(401, "User not authorized"));
    }
    const {subjectId, session, year, batch,branch } = await req.json();
    console.log({ subjectId, session, year, batch, branch });

    if (![subjectId, session, year,batch,branch].some((e) => e)) {
        return NextResponse.json(
            new ApiError(403, "Invalid details", "Invalid details")
        );
    }
    try {
        // Fetch students from batch "A" and "B"
        const students = await prisma.student.findMany({
            where: {
                batch: {
                    batch: { in: [batch] }, // Filter for batch names A and B
                },
            },
            select: { id: true, batchId: true }, // Only retrieve necessary fields
        });

        if (students.length === 0) {
            return NextResponse.json(new ApiError(404, "No students found","No students found"));
        }

        // Create enrollments for each student
        const enrollments = await prisma.enroll.createMany({
            data: students.map((student) => ({
                studentId: student.id,
                teacherId: id,
                subjectId: subjectId,
                batchId: student.batchId!,
                session: session,
                year: year,
            })),
        });
        if (enrollments) {
            console.log("No enrollments created.");
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: enrollments,
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
    } finally {
        await prisma.$disconnect();
    }
}


export async function GET(req: NextRequest) {
    const studentId = req.nextUrl.searchParams.get("id") ?? "";
    
    if (!studentId) {
        return NextResponse.json(new ApiError(401, "Student ID is required"));
    }

    try {
        // Fetch all enrollments where the student is enrolled
        const enrollments = await prisma.enroll.findMany({
            where: { studentId },
            include: {
                subject: { select: { subjectName: true } }, 
                teacher: { select: { id: true, firstName: true, lastName: true } }
            }
        });

        if (enrollments.length === 0) {
            return NextResponse.json(new ApiError(404, "No enrollments found", "No enrollments found"));
        }

        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: enrollments,
                message: "Student enrollments retrieved successfully"
            })
        );

    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return NextResponse.json(new ApiError(500, "Internal Server Error"));
    } finally {
        await prisma.$disconnect();
    }
}
