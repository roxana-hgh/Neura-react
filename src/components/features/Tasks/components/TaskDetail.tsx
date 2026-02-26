import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Checkbox } from "../../../ui/checkbox";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { ExternalLink, Plus, X, Calendar, Flag, Folder, Pencil, Trash2, Check } from "lucide-react";
import type { Task } from "../../../../types/Tasks";
import { useTasksStore } from "../stores/tasks";
import { getListColorClass } from "../utils/colorMapper";

import "./Task.styles.css"

interface IProps {
  task: Task;
  trigger?: React.ReactNode;
}

function TaskDetail({ task, trigger }: IProps) {
  const [open, setOpen] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | number | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState("");

  const toggleTask = useTasksStore((s) => s.toggleTask);
  const toggleSubTask = useTasksStore((s) => s.toggleSubTask);
  const updateTask = useTasksStore((s) => s.updateTask);
  const lists = useTasksStore((s) => s.lists);

  const parentList = task.list_id
    ? lists.find((l) => l.id === task.list_id)
    : null;

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) return;

    const newSubtask = {
      id: crypto.randomUUID(),
      title: subtaskTitle.trim(),
      completed: false,
    };

    updateTask(task.id, {
      ...task,
      subtasks: [...(task.subtasks ?? []), newSubtask],
    });

    setSubtaskTitle("");
    setAddingSubtask(false);
  };

  const handleRemoveSubtask = (subtaskId: string | number) => {
    updateTask(task.id, {
      ...task,
      subtasks: task.subtasks?.filter((s) => s.id !== subtaskId) ?? [],
    });
  };

  const handleStartEditSubtask = (subtaskId: string | number, currentTitle: string) => {
    setEditingSubtaskId(subtaskId);
    setEditingSubtaskTitle(currentTitle);
  };

  const handleSaveEditSubtask = () => {
    if (!editingSubtaskTitle.trim()) return;

    updateTask(task.id, {
      ...task,
      subtasks:
        task.subtasks?.map((s) =>
          s.id === editingSubtaskId
            ? { ...s, title: editingSubtaskTitle.trim() }
            : s
        ) ?? [],
    });

    setEditingSubtaskId(null);
    setEditingSubtaskTitle("");
  };

  const handleCancelEditSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle("");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };



  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500/80 dark:text-red-400/70";
      case "medium":
        return "text-amber-500/80 dark:text-amber-400/70";
      case "low":
        return "text-emerald-500/80 dark:text-emerald-400/70";
      default:
        return "text-neutral-500 dark:text-neutral-400";
    }
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label="View task details"
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-all duration-200 hover:scale-110"
          >
            <ExternalLink size={18} strokeWidth={1.5} />
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden border-neutral-200/60 dark:border-neutral-700/30 bg-white/98 dark:bg-neutral-900/98 backdrop-blur-2xl p-0 shadow-2xl">
        {/* Subtle ambient effect */}
        <div className="absolute inset-0 bg-linear-to-br from-neutral-100/50 via-transparent to-neutral-200/40 dark:from-neutral-900/10 dark:via-transparent dark:to-neutral-950/10 pointer-events-none" />
        
        <div className="relative overflow-y-auto max-h-[85vh] custom-scrollbar">
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-neutral-200 dark:border-neutral-800/50">
            <DialogTitle className="text-base font-normal tracking-tight">
              <div className="flex items-center gap-2.5 group">
                <Checkbox
                  checked={task.completed}
                  id={`task-detail-${task.id}`}
                  onCheckedChange={(checked) =>
                    toggleTask(task.id, checked as boolean)
                  }
                  className=" h-4 w-4 mt-0.5 transition-all duration-150"
                />
                <Label
                  className={`cursor-pointer font-normal text-base leading-snug transition-colors duration-150 ${
                    task.completed
                      ? "line-through text-neutral-400 dark:text-neutral-500"
                      : "text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
                  }`}
                  htmlFor={`task-detail-${task.id}`}
                >
                  {task.title}
                </Label>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {/* Metadata cards */}
            <div className="grid grid-cols-3 gap-2">
              {/* Due Date */}
              {task.due_date && (
                <div className="relative overflow-hidden rounded-md border border-neutral-300/60 dark:border-neutral-800/50 bg-neutral-50/80 dark:bg-neutral-800/15 p-2.5 transition-all duration-150 hover:border-neutral-300/60 dark:hover:border-neutral-700/40">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar size={11} className="text-neutral-400 dark:text-neutral-500" />
                    <span className="text-[9px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium">
                      Due
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-400">
                    {formatDate(task.due_date)}
                  </p>
                </div>
              )}

              {/* Priority */}
              <div className="relative overflow-hidden rounded-md border border-neutral-300/60 dark:border-neutral-800/50 bg-neutral-50/80 dark:bg-neutral-800/15 p-2.5 transition-all duration-150 hover:border-neutral-300/60 dark:hover:border-neutral-700/40">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Flag size={11} className="text-neutral-400 dark:text-neutral-500" />
                  <span className="text-[9px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium">
                    Priority
                  </span>
                </div>
                <p className={`text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </p>
              </div>

              {/* List */}
              {parentList && (
                <div className="relative overflow-hidden rounded-md border border-neutral-300/60 dark:border-neutral-800/50 bg-neutral-50/80 dark:bg-neutral-800/15 p-2.5 transition-all duration-150 hover:border-neutral-300/60 dark:hover:border-neutral-700/40">
                  <div className="flex items-center gap-1.5 mb-0.5">
                      <Folder size={11} className="text-neutral-400 dark:text-neutral-500" />
                    <span className="text-[9px] uppercase tracking-wide text-neutral-500 dark:text-neutral-500 font-medium">
                      List
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${getListColorClass(parentList.color)}`}
                    />
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-400 truncate">
                      {parentList.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description  */}
            {task.description && (
              <div className="space-y-1.5">
                <h3 className="text-[10px] uppercase tracking-wide text-neutral-600 dark:text-neutral-400 font-medium">
                  Description
                </h3>
                <div className="relative rounded-md border border-neutral-300/50 dark:border-neutral-800/50 bg-neutral-50/40 dark:bg-neutral-800/20 p-3">
                  <p className="whitespace-pre-line text-xs text-neutral-700 dark:text-neutral-400 leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>
            )}

            {/* Subtasks  */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-[10px] uppercase tracking-wide text-neutral-600 dark:text-neutral-400 font-medium">
                    Subtasks
                  </h3>
                  {totalSubtasks > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-20 bg-neutral-300 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neutral-600 dark:bg-neutral-500 transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium">
                        {completedSubtasks}/{totalSubtasks}
                      </span>
                    </div>
                  )}
                </div>

                {!addingSubtask && (
                  <button
                    type="button"
                    onClick={() => setAddingSubtask(true)}
                    className="flex items-center gap-1 text-[11px] font-medium text-neutral-700 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
                  >
                    <Plus size={12} />
                    Add
                  </button>
                )}
              </div>

              {/* Add subtask form  */}
              {addingSubtask && (
                <div className="flex items-center gap-1.5 p-2 rounded-md border border-neutral-300/60 dark:border-neutral-800/40 bg-neutral-100/50 dark:bg-neutral-900/30 animate-in fade-in duration-150">
                  <Input
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    placeholder="Subtask..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubtask();
                      if (e.key === "Escape") {
                        setAddingSubtask(false);
                        setSubtaskTitle("");
                      }
                    }}
                    className="text-xs h-7 bg-white dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 shadow-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:ring-offset-0 flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSubtask}
                    disabled={!subtaskTitle.trim()}
                    className="h-7 px-2 text-xs bg-neutral-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 hover:text-neutral-900 dark:text-neutral-300"
                  >
                     <Check size={12} />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingSubtask(false);
                      setSubtaskTitle("");
                    }}
                    className="h-7 w-7 text-neutral-600 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-400"
                  >
                    <X size={13} />
                  </Button>
                </div>
              )}

              {/* Subtask list */}
              <div className="space-y-0.5">
                {task.subtasks && task.subtasks.length > 0 ? (
                  task.subtasks.map((subtask, index) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 p-2 rounded-md border border-transparent hover:border-neutral-200/60 dark:hover:border-neutral-800/40 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-all duration-150 group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {editingSubtaskId === subtask.id ? (
                        // Edit mode
                        <>
                          <Input
                            value={editingSubtaskTitle}
                            onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEditSubtask();
                              if (e.key === "Escape") handleCancelEditSubtask();
                            }}
                            autoFocus
                            className="text-xs h-6 bg-white dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 flex-1"
                          />
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={handleSaveEditSubtask}
                            className="h-6 w-6 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                          >
                            <Check size={12} />
                          </Button>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={handleCancelEditSubtask}
                            className="h-6 w-6 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                          >
                            <X size={12} />
                          </Button>
                        </>
                      ) : (
                        // View mode
                        <>
                          <Checkbox
                            checked={subtask.completed}
                            id={`subtask-${task.id}-${subtask.id}`}
                            onCheckedChange={(checked) =>
                              toggleSubTask(task.id, subtask.id, checked as boolean)
                            }
                            className="h-3.5 w-3.5 transition-all duration-150"
                          />
                          <Label
                            className={`text-xs cursor-pointer flex-1 transition-colors duration-150 ${
                              subtask.completed
                                ? "line-through text-neutral-500 dark:text-neutral-500"
                                : "text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-300"
                            }`}
                            htmlFor={`subtask-${task.id}-${subtask.id}`}
                          >
                            {subtask.title}
                          </Label>
                          
                          {/* Action buttons - smaller and more subtle */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleStartEditSubtask(subtask.id, subtask.title)}
                              className="h-6 w-6 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                            >
                              <Pencil size={11} />
                            </Button>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleRemoveSubtask(subtask.id)}
                              className="h-6 w-6 text-neutral-400 hover:text-red-500/70 dark:text-neutral-500 dark:hover:text-red-400/70 hover:bg-red-50 dark:hover:bg-red-500/5"
                            >
                              <Trash2 size={11} />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-[12px] text-neutral-600 dark:text-neutral-600">
                      No subtasks yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Created date - minimal footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900/40">
              <p className="text-[10px] text-neutral-500 dark:text-neutral-500 uppercase tracking-wide">
                Created {formatDate(task.created_at)}
              </p>
            </div>
          </div>
        </div>

    
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetail;