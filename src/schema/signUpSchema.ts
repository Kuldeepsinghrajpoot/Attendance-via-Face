import { z } from 'zod';

export const signUpSchema = z.object({
    Firstname: z.string().min(1,"First name is required"),
    lastname: z.string(),
    password: z.string().min(5, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
    avatar: z.custom((value) => {
        if (!value) {
            throw new Error('Avatar is required for user registration');
        }
        return value;
    }),
    rollNumber: z.string().min(1, 'Roll number is required for registration'),
    // phone: z.string().min(0, 'Phone number is required for registration'),
  
    batch: z.string().min(1, 'Batch is required for registration'),
    branch: z.string().min(1, 'Branch is required for registration'),
});
