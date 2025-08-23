"use server";

import { TaskActionState } from "@/@types/task.types";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string): Promise<TaskActionState> {
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
        message: "Task not found or you do not have permission to delete it.",
      };
    }

    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/");
    return {
      success: true,
      status: "success",
      message: "Task deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      status: "error",
      message: `Failed to delete task. Please try again later.: ${error}`,
    };
  } finally {
    await prisma.$disconnect();
  }
}
