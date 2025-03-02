import { z } from "zod";

export const roleSchema = z.object({
    email: z.string().email("Email is required"),
    password: z.string().min(5, "Password is required"),
    role: z.string().min(1, "Role is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "Phone is required"),
});

export type RoleSchema = z.infer<typeof roleSchema>;