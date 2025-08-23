"use server";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { log } from "console";

// Read Tasks
export async function getTasks() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  try {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      log(`Database error in getTasks: ${error.code} - ${error.message}`);
      return []; // Return empty array for known Prisma errors
    }
    log(`Unexpected error in getTasks: ${error}`);
    return []; // Return empty array for other errors
  } finally {
    await prisma.$disconnect();
  }
}

// Get Single Task
export async function getTaskById(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return {
      success: false,
      status: "error",
      message: "You must be logged in to create a task.",
    };
  }

  try {
    return await prisma.task.findUnique({
      where: { id, userId },
    });
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
