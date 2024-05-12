import { z } from "zod";

export const signInSchema = z.object({
    email:z.string().email('email is required'),
    password:z.string().min(5,'password is required')
}) 