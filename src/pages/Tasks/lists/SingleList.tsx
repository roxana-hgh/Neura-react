import { useParams } from "react-router-dom";
import { useTasksByList } from "../../../components/features/Tasks/utils/taskSelectors";
import AddNewTask from "../../../components/features/Tasks/components/AddTask";
import TasksList from "../../../components/features/Tasks/components/TasksList/TasksList";
import { useTasksStore } from "../../../components/features/Tasks/stores/tasks";
import { getListColorClass } from "../../../components/features/Tasks/utils/colorMapper";
import EditList from "../../../components/features/Tasks/components/Lists/editList";

function SingleList() {
  const params = useParams();
  const Tasks = useTasksByList(Number(params.id));
  const list = useTasksStore((s) =>
    s.lists.find((l) => l.id === Number(params.id)),
  );
  return (
    <div className="tasks-page container mx-auto ">
      <div className="flex items-start justify-between  mb-3">
        <div className="flex items-start gap-2">
          <span
            className={`p-2 rounded-full mt-2 ${getListColorClass(list?.color ?? "gray")}`}
          ></span>
          <div className="">
            <h3 className="font-bold text-xl mb-1 ">{list?.name} Tasks</h3>
            <p className="text-muted-foreground text-sm">
              Here's a list of your {list?.name} Tasks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
            {list && <EditList list={list} />}
      
        <AddNewTask defaultListId={list?.id}  />
        </div>
      </div>
      <div className="mb-3">
        <TasksList tasks={Tasks} label={list?.name ?? " "} />
      </div>
    </div>
  );
}

export default SingleList;
