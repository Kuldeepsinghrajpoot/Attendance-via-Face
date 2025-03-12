import { z } from "zod";

export const addSubject = z.object({
    subjectname: z.string().min(1, "Subject Id is required"),
  
});

export type AddSubject = z.infer<typeof addSubject>;
