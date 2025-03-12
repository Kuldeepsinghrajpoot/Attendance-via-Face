import { z } from "zod";

export const addBatch = z.object({
    batch: z.string().min(1, "Batch  is required"),
  
});

export type AddBatch = z.infer<typeof addBatch>;
