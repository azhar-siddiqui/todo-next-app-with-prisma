"use server";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { taskFormSchema } from "@/validation/taskFormSchema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function creatTaskActions(values: z.infer<typeof taskFormSchema>) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      status: "error",
      message: "You must be logged in to create a task.",
    };
  }

  const result = taskFormSchema.safeParse(values);

  if (!result.success) {
    return {
      status: "error",
      message: result.error.issues.map((issue) => issue.message).join(", "),
      // message: result.error.message,
    };
  }

  try {
    // Fetch user details to get email
    const user = await currentUser();
    const email =
      user?.emailAddresses?.[0]?.emailAddress || "unknown@example.com";

    // Upsert user in the database
    await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: {
        id: userId,
        email,
      },
    });

    const task = await prisma.task.create({
      data: {
        title: result.data.title,
        description: result.data.description || null,
        completed: result.data.completed || false,
        userId,
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
