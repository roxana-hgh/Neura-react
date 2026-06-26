import { useState } from "react";
import TaskForm from "./TaskForm";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import type { TaskFormValues } from "../schema/task.schema";
import { useCreateTask } from "../hooks/useTasks";
import { toast } from "../../../../lib/toast";


interface IProps {
  // Pass the current list's id when rendering this button inside a list page.
  // Leave undefined (or don't pass it) on the "All Tasks" page.
  defaultListId?: string | number | null;
}

function AddNewTask({ defaultListId }: IProps) {
  const [openModal, setOpenModal] = useState(false);

const { mutate: createTask } = useCreateTask();

const handleSubmit = (values: TaskFormValues) => {
  createTask(values, {
    onSuccess: () => {
     setOpenModal(false);
     toast.success("Task created successfully!");
    },
    onError: (error) => {
      toast.error(`Error creating task: ${error.message}`);
    }
  });
};

  // const submitHandler = (data: TaskFormValues) => {
  //   addTask({
  //     ...data,
  //     id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 5,
  //     completed: false,
  //     created_at: new Date().toISOString().split("T")[0],
  //     subtasks: [],
  //     // list_id comes from the form — already set correctly
  //     list_id: data.list_id ?? null,
  //     description: data.description ?? null,
  //     due_date: data.due_date ?? null,
  //   });
  //   setOpenModal(false);
  // };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          Add Task <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill the form below to add a new task.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          defaultListId={defaultListId}
          onSubmit={handleSubmit}
          submitLabel="Add Task"
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddNewTask;