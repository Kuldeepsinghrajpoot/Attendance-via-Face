import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.searchParams.get("id") ?? "";
    if (!id) {
        return NextResponse.json(
            new ApiError(401, "user not authorized", "user not authorized")
        );
    }

    const { batch } = await req.json();
    if (!batch) return NextResponse.json(new ApiError(402, "Invalid details", "Invalid details"));

    try {
        const response = await prisma.batch.create({
            data: {
                batch,
            },
        });

        if (response) {
            return NextResponse.json({
                status: 200,
                data: response,
                message: "Batch created successfully",
            });
        }
        return NextResponse.json(
            new ApiError(403, "Batch not created", "Batch not created")
        );
    } catch (error) {
        return NextResponse.json(new ApiError(403, "Batch not created", error));
    }
}
