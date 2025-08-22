import z from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});
