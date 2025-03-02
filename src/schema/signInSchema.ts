import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("email is required"),
    password: z.string().min(5, "password is required"),
    phone: z.string().min(1, "enter the phone number"),
    role: z.string().min(1, "enter the role"),
    firstName: z.string().min(1, "enter the firstName"),
});

export type LoginType = z.infer<typeof signInSchema>;
