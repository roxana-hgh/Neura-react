
import AddNewTask from "../../components/features/Tasks/components/AddTask";
import TasksSearch from "../../components/features/Tasks/components/TaskSearch";
import TasksList from "../../components/features/Tasks/components/TasksList/TasksList";
import { useTasks } from "../../components/features/Tasks/hooks/useTasks";
import Loader from "../../components/ui/loader";

function TasksPage() {
  //const sortedTasks = useAllTasksSortedByDueDate()
  const { data: tasks, isPending } = useTasks();


  return (
    <div className="tasks-page container mx-auto ">
      <div className="flex items-center justify-between mb-3">
        <div className=" ">
          <h3 className="font-bold text-xl mb-1">Your Tasks</h3>
          <p className="text-muted-foreground text-sm">
            Here's a list of your tasks
          </p>
        </div>
        <div className="flex items-center  flex-wrap gap-2 ">
          <div className="grow">
            <TasksSearch />
          </div>
          <div className="shrink-0">
            <AddNewTask />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <TasksList tasks={tasks} label="Upcoming Tasks" />
      </div>

      {isPending && <Loader screen />}
    </div>
  );
}

export default TasksPage;
