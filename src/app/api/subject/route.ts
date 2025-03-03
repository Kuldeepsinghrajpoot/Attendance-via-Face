import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient();
interface Subject {
    subject: string;
}

export async function POST(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") ?? "";
    if (!id) {
        return NextResponse.json(new ApiError(401, "User not authorized"));
    }

    try {
        const { subject }: Subject = await req.json();
        if ([subject].some((e) => !e)) {
            return NextResponse.json(
                new ApiError(402, "Invalid details", "Invalid Details")
            );
        }
        // Update teacher with new subject
        const response = await prisma.subject.create({
            data: {
                subjectName: subject,
            },
        });
        if (response) {
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: "Subject created successfully",
                })
            );
        }
        return NextResponse.json(
            new ApiError(403, "Subject not created", "Subject not created")
        );
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            new ApiError(403, "Something went wrong", error)
        );
    }
}

// get the subjects
export async function GET(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(new ApiError(403, "", "id not found"));
    }
    try {
        const response = await prisma.subject.findMany();
        if (response) {
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: response,
                    message: "Fetched successfully",
                })
            );
        }
        return NextResponse.json(
            new ApiError(403, "Subject not found", "Subject not found")
        );
    } catch (error) {
        return NextResponse.json(
            new ApiError(403, "You are not authorized", error)
        );
    }
}
