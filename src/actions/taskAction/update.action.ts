"use server";

import { TaskActionState } from "@/@types/task.types";
import { prisma } from "@/lib/db";
import { taskFormSchema } from "@/validation/taskFormSchema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function updateTaskAction(
  id: string,
  values: z.infer<typeof taskFormSchema>
): Promise<TaskActionState> {
  const validated = taskFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      status: "error",
      message: validated.error.issues.map((issue) => issue.message).join(", "),
    };
  }

  try {
    // Fetch the existing task
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return {
        success: false,
        status: "error",
        message: "Task not found.",
      };
    }

    // Check if there are any changes
    const hasChanges =
      existingTask.title !== validated.data.title ||
      existingTask.description !== (validated.data.description || null) ||
      existingTask.completed !== (validated.data.completed || false);

    if (!hasChanges) {
      return {
        success: false,
        status: "error",
        message: "No changes detected. Please modify the task before updating.",
      };
    }

    const task = await prisma.task.update({
      where: { id },
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
      message: "Task updated successfully",
      task,
    };
  } catch (error) {
    return {
      success: false,
      status: "error",
      message: `Failed to update task. Please try again later.: ${error}`,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function toggleTaskCompletion(
  id: string,
  completed: boolean
): Promise<TaskActionState> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      status: "error",
      message: "You must be logged in to update a task.",
    };
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id, userId },
    });

    if (!task) {
      return {
        success: false,
        status: "error",
        message: "Task not found or you do not have permission to update it.",
      };
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed },
    });

    revalidatePath("/");
    return {
      success: true,
      status: "success",
      message: `Task marked as ${completed ? "completed" : "uncompleted"}`,
      task: updatedTask,
    };
  } catch (error) {
    return {
      success: false,
      status: "error",
      message: `Failed to update task completion status. Please try again later. ${error}`,
    };
  } finally {
    await prisma.$disconnect();
  }
}
