import { Input } from "../../../ui/input";
import { useTasksStore } from "../stores/tasks";

function TasksSearch() {
    const search = useTasksStore((state) => state.search);
    const setSearch = useTasksStore((state) => state.setSearch);
    return ( 
        <div className=" flex w-full   gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks"
              className="max-w-sm w-full rounded-lg outline-0 focus:ring-0"
            />
            
          </div>
     );
}

export default TasksSearch;