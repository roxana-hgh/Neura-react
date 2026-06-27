import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/dialog";
import AddNewTask from "./AddTask";
import type { Task } from "../../../../types/Tasks";

interface Props {
  date: Date;
  tasks: Task[];
  open: boolean;
  onClose: () => void;
}

export function DayTasksModal({ date, tasks, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 flex flex-col max-h-[80vh]">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-neutral-200 dark:border-neutral-800/50">
          <DialogDescription className="text-[10px] font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-1">
            {format(date, "EEEE")}
          </DialogDescription>
          <DialogTitle className="text-base font-normal text-neutral-800 dark:text-neutral-200">
            {format(date, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>

        {/* Task list — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 min-h-0">
          {tasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-neutral-500 dark:text-neutral-600">
                No tasks for this day
              </p>
            </div>
          ) : (
            // task row inside modal-body map
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2.5 rounded-md border border-transparent
               hover:border-neutral-200/60 dark:hover:border-neutral-800/40
               hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20
               transition-all duration-150 group"
              >
                {/* Completion circle */}
                <div
                  className={[
                    "w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center",
                    task.completed
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-neutral-300 dark:border-neutral-700",
                  ].join(" ")}
                >
                  {task.completed && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4L3.5 6L6.5 2"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <p
                    className={[
                      "text-sm truncate",
                      task.completed
                        ? "line-through text-neutral-400 dark:text-neutral-500"
                        : "text-neutral-800 dark:text-neutral-200",
                    ].join(" ")}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Priority pill — matches TaskDetail */}
                <span
                  className={[
                    "text-[10px] font-medium px-1.5 py-0.5 rounded capitalize flex-shrink-0",
                    task.priority === "high"
                      ? "bg-red-500/10 text-red-500/80 dark:text-red-400/70"
                      : task.priority === "medium"
                        ? "bg-amber-500/10 text-amber-500/80 dark:text-amber-400/70"
                        : "bg-emerald-500/10 text-emerald-500/80 dark:text-emerald-400/70",
                  ].join(" ")}
                >
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border shrink-0 [&>button]:w-full">
          <AddNewTask initialDueDate={date} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
