import { Task } from "@/@types/task.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getTasks } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { Trigger } from "./_components/Trigger";

export default async function Home() {
  const tasks = await getTasks();
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="border-b">
          <CardTitle className="w-full flex items-center justify-between">
            <h1 className="text-xl font-bold">Tasks</h1>
            <Trigger />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 max-h-[600px] overflow-y-auto">
          {tasks.map((task: Task) => (
            <div
              className="flex items-center justify-between border p-4 rounded-lg"
              key={task.id}
            >
              <div className="flex items-center gap-3">
                <Checkbox id="terms" checked={task.completed} />
                <p className={cn(task.completed && "line-through")}>
                  {task.title}
                </p>
              </div>
              <Button size="icon" variant="outline">
                <Pencil />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
