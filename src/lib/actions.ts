"use server";

import { Task } from "@/@types/task.types";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export type TaskActionState = {
  success: boolean;
  status: "success" | "error";
  message?: string;
  task?: Task;
};

// Read Tasks
export async function getTasks() {
  return prisma.task.findMany({ orderBy: { createdAt: "asc" } });
}

// Get Single Task
export async function getTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}
