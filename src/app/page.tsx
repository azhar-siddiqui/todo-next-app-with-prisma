import { Task } from "@/@types/task.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTasks } from "@/actions/taskAction/get.action";
import { TaskItem } from "./_components/TaskItem";
import { Trigger } from "./_components/Trigger";

export default async function Home() {
  const tasks = await getTasks();
  return (
    <div className="w-full min-h-[calc(100vh-50px)] flex items-center justify-center">
      <Card className="w-full max-w-xl mx-4">
        <CardHeader className="border-b">
          <CardTitle className="w-full sm:flex items-center justify-between">
            <h1 className="text-xl font-bold">Tasks</h1>
            <Trigger />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 min-h-10 max-h-[600px] overflow-y-auto">
          {tasks?.length ? (
            tasks.map((task: Task) => <TaskItem key={task.id} task={task} />)
          ) : (
            <p className="text-center">
              No tasks found. Try creating a new task to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
