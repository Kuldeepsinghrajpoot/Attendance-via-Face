import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { UserSchema } from '@/schema/UserSchema'

const prisma = new PrismaClient();
export async function POST(request: Request): Promise<Response> {
    try {
        const formData = await request.formData();
        const userData: UserSchema = {
            Firstname: formData.get("Firstname") as string,
            lastname: formData.get("lastname") as string,
            rollNumber: formData.get("rollNumber") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            avatar: formData.get("avatar") as File,
        };

        // Validation
        if (!userData.Firstname || !userData.lastname || !userData.rollNumber || !userData.email || !userData.password || !userData.avatar) {
            throw new Error("All fields are required.");
        }
        // Process avatar file
        const dataBytes = await userData.avatar.arrayBuffer();
        const buffer = Buffer.from(dataBytes);
        const fileName = `${Date.now()}.jpeg`;
        const path = `./public/temp/${fileName}`;
        await writeFile(path, new Uint8Array(buffer));

        // Insert user data into the database
        await prisma.student.create({
            data: {
                role:"STUDENT",
                Firstname: userData.Firstname,
                lastname: userData.lastname,
                rollNumber: userData.rollNumber,
                email: userData.email,
                password: userData.password, // Should be hashed before storing in production
                avatar: fileName, // Save only the file name in the database
            },
        });

        return Response.json({ message: 'User created successfully' }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {

        return Response.json({ message: 'Server error' }, {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
