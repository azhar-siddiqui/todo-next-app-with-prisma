"use client";

import { Task } from "@/@types/task.types";
import { deleteTask } from "@/actions/delete.action";
import { toggleTaskCompletion } from "@/actions/update.action";
import EditTask from "@/components/common/editTask";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Eye, Pencil, Trash } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const TaskItem = ({ task }: { task: Task }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCheckboxChange = (checked: boolean) => {
    startTransition(async () => {
      const result = await toggleTaskCompletion(task.id, checked);
      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.status === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  return (
    <>
      <div
        className="flex items-center justify-between border p-4 rounded-lg"
        key={task.id}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            id={`terms-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleCheckboxChange}
            disabled={isPending}
          />
          <div className={cn(task.completed && "line-through")}>
            <p>{task.title}</p>
            <p className="text-sm opacity-75">{task.description}</p>
          </div>
        </div>

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline">
                  <Pencil />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Action</TooltipContent>
          </Tooltip>
          <PopoverContent
            className="w-40 p-2 flex flex-col space-y-2"
            align="end"
          >
            <Button
              variant="outline"
              className="w-full flex justify-start"
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
              Edit Task
            </Button>
            <Button variant="outline" className="w-full flex justify-start">
              <Eye />
              View Task
            </Button>
            <Button
              variant="outline"
              className="w-full flex justify-start"
              onClick={handleDelete}
            >
              <Trash className="text-red-400" />
              Delete Task
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <EditTask open={editOpen} setOpen={setEditOpen} task={task} />
    </>
  );
};
