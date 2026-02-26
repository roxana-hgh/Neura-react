/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { parseDate } from "chrono-node";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../../ui/calendar";
import { Textarea } from "../../../ui/textarea";
import { Button } from "../../../ui/button";
import { Spinner } from "../../../ui/spinner";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskSchema } from "../schema/task.schema";
import type { TaskFormValues } from "../schema/task.schema";
import type { Task } from "../../../../types/Tasks";
import { useTasksStore } from "../stores/tasks";
import { getListColorClass } from "../utils/colorMapper";



interface IProps {
  initialValues?: Partial<Task>;
  // defaultListId: the list to pre-select when opening the form.
  // Pass the current list's id when opening from a list page,
  // or null / undefined when opening from the "All Tasks" page.
  defaultListId?: string | number | null;
  onSubmit: (task: TaskFormValues) => void;
  submitLabel: string;
}

function formatDate(date: Date | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function TaskForm({ initialValues, defaultListId, onSubmit, submitLabel }: IProps) {
  const lists = useTasksStore((s) => s.lists);

  const [open, setOpen] = useState(false);
  const [dateInput, setDateInput] = useState<string>(
    initialValues?.due_date ?? ""
  );
  const [date, setDate] = useState<Date | undefined>(
    initialValues?.due_date ? new Date(initialValues.due_date) : undefined
  );
  const [loader, setLoader] = useState(false);

  // Resolve the effective default list_id:
  // 1. If editing an existing task, use its own list_id
  // 2. Otherwise fall back to defaultListId (the page we're on)
  const effectiveListId =
    initialValues?.list_id !== undefined
      ? initialValues.list_id
      : (defaultListId ?? null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      priority: initialValues?.priority ?? "medium",
      description: initialValues?.description ?? null,
      due_date: initialValues?.due_date ?? null,
      list_id: effectiveListId,
    },
  });

  // Sync date picker if initialValues change (e.g. edit modal opens)
  useEffect(() => {
    if (initialValues?.due_date) {
      setDateInput(initialValues.due_date);
      setDate(new Date(initialValues.due_date));
    }
  }, [initialValues?.due_date]);

  const onValidSubmit = (data: TaskFormValues) => {
    setLoader(true);
    
    onSubmit({
      ...data,
      due_date: date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
        : null,
      list_id: data.list_id
    });
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)}>
      <div className="grid grid-cols-2 gap-4 mb-3">

        {/* ── Title ── */}
        <div className="col-span-2">
          <Label className="mb-2">Title</Label>
          <Input {...register("title")} placeholder="Task title" />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* ── Priority + Due Date ── */}
        <div className="col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* Priority */}
            <div className="col-span-1">
              <Label className="mb-2">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="col-span-1">
              <div className="flex justify-between items-end mb-2">
                <Label>Due Date</Label>
                <span className="text-xs text-muted-foreground">
                  {formatDate(date)}
                </span>
              </div>
              <InputGroup>
                <InputGroupInput
                  value={dateInput}
                  placeholder="Tomorrow or next week"
                  onChange={(e) => {
                    setDateInput(e.target.value);
                    const parsed = parseDate(e.target.value);
                    if (parsed) setDate(parsed);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Select date"
                        className="px-1"
                      >
                        <CalendarIcon />
                        <span className="sr-only">Select date</span>
                      </InputGroupButton>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      sideOffset={8}
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        defaultMonth={date}
                        onSelect={(selected) => {
                          setDate(selected);
                          setDateInput(formatDate(selected));
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </div>

        {/* ── List ── */}
        <div className="col-span-2">
          <Label className="mb-2">List</Label>
          <Controller
            name="list_id"
            control={control}
            render={({ field }) => (
              <Select
                // Select requires string values — we convert null to the
                // sentinel string "none" and convert back on change
                value={field.value != null ? String(field.value) : "none"}
                onValueChange={(val) =>
                  field.onChange(val === "none" ? null : val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-muted-foreground">No list</span>
                  </SelectItem>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={String(list.id)}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${getListColorClass(list.color)}`}
                        />
                        {list.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.list_id && (
            <p className="text-sm text-red-500 mt-1">
              {errors.list_id.message}
            </p>
          )}
        </div>

        {/* ── Description ── */}
        <div className="col-span-2 mb-3">
          <Label className="mb-2">Description</Label>
          <Textarea
            {...register("description")}
            placeholder="Add a description..."
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loader}>
        {loader ? <Spinner /> : submitLabel}
      </Button>
    </form>
  );
}

export default TaskForm;