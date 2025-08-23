export interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskActionState = {
  success: boolean;
  status: "success" | "error";
  message?: string;
  task?: Task;
};
