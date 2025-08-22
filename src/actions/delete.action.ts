'use server'
import { TaskActionState } from "@/lib/actions";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function deleteTask(id: string): Promise<TaskActionState> {
  try {
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
