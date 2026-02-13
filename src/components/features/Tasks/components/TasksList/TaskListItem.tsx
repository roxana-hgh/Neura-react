import { GitBranch, Pencil, Tag, Trash } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Checkbox } from "../../../../ui/checkbox";
import { Label } from "../../../../ui/label";
import type { Task } from "../../../../../types/Tasks";
import { useTasksStore } from "../../stores/tasks";
import { getListColorClass } from "../../utils/colorMapper";


interface Iprops {
  task: Task;
}

function TaskListItem({ task }: Iprops) {
  const list = useTasksStore(s => s.lists.find(l => l.id === task.list_id))
  const toggleTask = useTasksStore((state) => state.toggleTask);
  const removeTask = useTasksStore((state) => state.removeTask);
  return (
    <div className="task-item group py-3 border-b  w-full">
      <div className="flex items-start w-full  gap-4">
        <div className="py-1">
          <Checkbox
            checked={task.completed}
            id={`task-item${task.id}`}
            onCheckedChange={(checked) => toggleTask(task.id, Boolean(checked))}
          />
          <Label className="hidden" htmlFor={`task-item${task.id}`}></Label>
        </div>
        <div className="grow">
          <h5 className={` text-base mb-1 ${task.completed ? "line-through text-muted-foreground" : "font-medium"}`}>{task.title}</h5>
          {task.description && (
            <p className="text-sm whitespace-break-spaces line-clamp-1 text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="flex gap-3 items-center mt-2 ">
            {task.subtasks && task.subtasks?.length > 0 && (
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex gap-1 items-center">
                <GitBranch size={14} />
                {task.subtasks.filter((subtask) => subtask.completed).length} /
                {task.subtasks.length}
              </span>
            )}

            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Due{" "}
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "No due date"}
            </span>
            <span
              className={` text-xs rounded-full flex gap-1 items-center  ${
                task.priority === "high"
                  ? "text-red-600 dark:text-red-300"
                  : task.priority === "low"
                    ? "text-green-600 dark:text-green-300"
                    : task.priority === "medium"
                      ? "text-amber-600 dark:text-amber-300"
                      : "text-neutral-400"
              }`}
            >
              <Tag size={12} /> {task.priority}
            </span>
            {task.list_id && (
              <span className="text-xs rounded-full flex gap-1 items-center">
                <span
                  className={`p-1 rounded-full ${getListColorClass(list?.color?? "gray")}`}
                ></span>
                {list?.name}
              </span>
            )}
          </div>
        </div>
        <div className="task-action  hidden group-hover:flex items-center justify-self-end">
          <Button size="icon-sm" aria-label="" variant="ghost">
            <Pencil />
          </Button>
          <Button
            size="icon-sm"
            aria-label="remove task"
            className="text-muted-foreground "
            variant="ghost"
            onClick={() => removeTask(task.id)}
          >
            <Trash className=" hover:text-red-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskListItem;
