import AddNewTask from "../../components/features/Tasks/components/AddTask";
import TasksSearch from "../../components/features/Tasks/components/TaskSearch";
import TasksList from "../../components/features/Tasks/components/TasksList/TasksList";
import { useAllTasksSortedByDueDate } from "../../components/features/Tasks/utils/taskSelectors";


function TasksPage() {
  const sortedTasks = useAllTasksSortedByDueDate()
  
  


  return (
    <div className="tasks-page container mx-auto ">
      <div className=" mb-3">
        <h3 className="font-bold text-xl mb-1">Your Tasks</h3>
        <p className="text-muted-foreground text-sm">
          Here's a list of your tasks
        </p>
      </div>
      <div className="flex items-center justify-between">
        <TasksSearch />
        <AddNewTask />
      </div>
      <div className="mb-3">
        <TasksList tasks={sortedTasks} label="Upcoming Tasks" />
      </div>
       
    </div>
  );
}

export default TasksPage;
