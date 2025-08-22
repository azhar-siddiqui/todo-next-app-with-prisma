'use server'

import { createTask } from "@/lib/actions";
import { taskFormSchema } from "@/validation/taskFormSchema";
import z from "zod";

export async function creatTaskActions(values: z.infer<typeof taskFormSchema>) {
  const result = taskFormSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }

  return createTask(values);
}
