import { useState } from "react";
import { Plus } from "lucide-react";
import type { ListFormValues } from "../../schema/list.schema";
import { useTasksStore } from "../../stores/tasks";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../../ui/dialog";
import { Button } from "../../../../ui/button";
import ListForm from "./Listform";


function AddNewList() {
  const [open, setOpen] = useState(false);
  const addList = useTasksStore((s) => s.addList);

  const submitHandler = (data: ListFormValues) => {
    addList({
      id: crypto.randomUUID(),
      name: data.name,
      color: data.color,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Plus /> New List
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New List</DialogTitle>
          <DialogDescription>
            Create a new list to organise your tasks.
          </DialogDescription>
        </DialogHeader>

        <ListForm onSubmit={submitHandler} submitLabel="Create List" />
      </DialogContent>
    </Dialog>
  );
}

export default AddNewList;