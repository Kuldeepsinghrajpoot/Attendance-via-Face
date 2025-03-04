import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { UserSchema } from "@/schema/UserSchema";
import { NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";

const prisma = new PrismaClient();
export async function POST(request: NextResponse, response: NextResponse) {
    const formData = await request.formData();

    const userData: UserSchema = {
        Firstname: formData.get("Firstname") as string,
        lastname: formData.get("lastname") as string,
        rollNumber: formData.get("rollNumber") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone: formData.get("phone") as string,
        role: formData.get("role") as string,
        batch: formData.get("batch") as string,
        branch: formData.get("branch") as string,
        avatar: formData.get("avatar") as File,
    };
    const {Firstname,lastname,rollNumber,email,password,batch,avatar,branch} = userData;
    console.log({Firstname,lastname,rollNumber,email,password,batch,avatar,branch})

    try {
        // Validation
        if (![Firstname,lastname,rollNumber,email,password,,batch,avatar].every((e) => e)) {
            return NextResponse.json(
                new ApiError(402, "Invalid details", "Invalid details")
            );
        }
        // Process avatar file
        const dataBytes = await userData.avatar.arrayBuffer();
        const buffer = Buffer.from(dataBytes);
        const fileName = `${Date.now()}.jpeg`;
        const path = `./public/temp/${fileName}`;
        await writeFile(path, new Uint8Array(buffer));

        const batchData = await prisma.batch.findUnique({
            where: {
                batch
            },
            select: {
                id: true
            }
        })
        if (!batchData) {
            return NextResponse.json(new ApiError(404, "Batch not found", "Batch not found"));
        }
        const branchData = await prisma.branch.findUnique({
            where: {
                branchName: branch
            },
            select: {
                id: true
            }
        })
        if (!branchData) {
            return NextResponse.json(new ApiError(404, "Branch not found", "Branch not found"));
            
        }
        // Insert user data into the database
        const res = await prisma.student.create({
            data: {
                role: "STUDENT",
                Firstname, 
                lastname,
                rollNumber,
                email,
                password,// Should be hashed before storing in production
                avatar: fileName, // Save only the file name in the database
                batch: {
                    connect: {
                        id: batchData?.id,
                    },
                },
                branch: {
                    connect: {
                        id: branchData?.id,
                    },
                },
            },
        });
        console.log(res);
        if (res) {
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: "User created successfully",
                })
            );
        }
        return NextResponse.json(
            new ApiError(403, "User not created", "User not created")
        );
    } catch (error) {
        return NextResponse.json(
            new ApiError(403, "Something went wrong", "something went wrong")
        );
    }
}
