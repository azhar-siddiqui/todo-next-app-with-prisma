"use server";

import { taskFormSchema } from "@/validation/taskFormSchema";
import { revalidatePath } from "next/cache";
import z from "zod";
import { Prisma, PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function creatTaskActions(values: z.infer<typeof taskFormSchema>) {
  const result = taskFormSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: result.data.title,
        description: result.data.description || null,
        completed: result.data.completed || false,
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
