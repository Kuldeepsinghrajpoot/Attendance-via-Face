import { z } from "zod";

export const roleSchena = z.object({
    email:z.string().email('email is required'),
    password:z.string().min(5,'password is required'),
    role:z.string().min(1,'password is required')
}) 


export type RoleSchema = z.infer<typeof roleSchena>