import { z } from "zod";

export const formSchema = z.object({
    startTime: z.date({ required_error: "Start time is required." }),
    endTime: z.date({ required_error: "End time is required." }),

});

export type FormSchema = z.infer<typeof formSchema>;
