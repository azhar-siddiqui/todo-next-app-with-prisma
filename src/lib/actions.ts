"use server";

import { Task } from "@/@types/task.types";
import { taskFormSchema } from "@/validation/taskFormSchema";
import { revalidatePath } from "next/cache";
import z from "zod";
import { Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export type TaskActionState = {
  success: boolean;
  status: "success" | "error";
  message?: string;
  task?: Task;
};

// Create Task
export async function createTask(
  values: z.infer<typeof taskFormSchema>
): Promise<TaskActionState> {
  const validated = taskFormSchema.safeParse(values);

  console.log("Validation result:", validated);

  if (!validated.success) {
    return {
      success: false,
      status: "error",
      message: validated.error.issues.map((issue) => issue.message).join(", "),
    };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: validated.data.title,
        description: validated.data.description || null,
        completed: validated.data.completed || false,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      status: "success",
      message: "Task created successfully",
      task,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        status: "error",
        message: `Database error: ${error.message}`,
      };
    }
    return {
      success: false,
      status: "error",
      message: "Failed to create task. Please try again later.",
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Read Tasks
export async function getTasks() {
  return prisma.task.findMany({ orderBy: { createdAt: "asc" } });
}

// Get Single Task
export async function getTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}
