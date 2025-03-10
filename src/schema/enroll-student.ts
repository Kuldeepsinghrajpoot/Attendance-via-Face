import { z } from "zod";

export const enrollSchema = z.object({
    subjectId: z.string().min(1, "Subject Id is required"),
    branchId: z.string().min(1, "Branch is required"),
    session: z.string().min(1, "Session is required"),
    year: z.string().min(2, " Year is required"),
    batchId: z.string().min(1, "Batch Id is required"),
});

export type EnrollSchema = z.infer<typeof enrollSchema>;
