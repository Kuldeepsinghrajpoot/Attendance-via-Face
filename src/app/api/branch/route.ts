import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: NextRequest, res: NextResponse) {
    const id = await req.nextUrl.searchParams.get('id');

    if (!id) return NextResponse.json(new ApiError(401, 'User not authorized'));

    const {branch} = await req.json()
     if(!branch) return NextResponse.json(new ApiError(402, 'Invalid details'));

     try {
        const response = await prisma.branch.create({
            data: {
                branchName: branch,
            }
        })

        if (response) {
            return NextResponse.json({
                status: 200,
                data: response,
                message: 'Branch created successfully'
            })
            
        }
        return NextResponse.json(new ApiError(403, 'Branch not created',"Branch not created"));
     } catch (error) {
        return NextResponse.json(new ApiError(403, 'Branch not created', error));
     }
}

// get branch

export async function GET(req: NextRequest, res: NextResponse) {
    const id = await req.nextUrl.searchParams.get('id');

    if (!id) return NextResponse.json(new ApiError(401, 'User not authorized'));

    try {
        const response = await prisma.branch.findMany({});
        if (response) {
            return NextResponse.json({
                status: 200,
                data: response,
                message: 'Branch fetched successfully'
            })
        }
        return NextResponse.json(new ApiError(403, 'Branch not fetched', 'Branch not fetched'));
    } catch (error) {
        return NextResponse.json(new ApiError(403, 'Branch not fetched', error));
    }
}