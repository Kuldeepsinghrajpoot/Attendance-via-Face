import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient();
export async function GET(res: NextResponse, req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(new ApiError(400, "Bad Request", "ID not provided"));
    }

    try {
        const [branch, batch, subject] = await Promise.all([
            prisma.branch.findMany({
                select: {
                    id: true,
                    branchName: true
                }
            }),
            prisma.batch.findMany({
                select: {
                    id: true,
                    batch: true
                }
            }),
            prisma.subject.findMany({
                select: {
                    id: true,
                    subjectName: true
                }
            })

        ])
        if (!branch || !batch || !subject) {
            return NextResponse.json(new ApiError(404, "Not Found", "Branch, Batch or Subject not found"));
        }
        return NextResponse.json(new ApiResponse({ status: 200, data: { branch, batch, subject, message: "Successfully fetched data" } }));
    } catch (error) {
        return NextResponse.json(new ApiError(500, "Internal Server Error", error));
    }
}