import { RefreshCw, Stars, Timer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import TaskItemSummery from "../../components/features/Tasks/components/TasksList/TaskListItemSummery";
import { useNotesStore } from "../../components/features/Notes/stores/notes";
import NoteItem from "../../components/features/Notes/components/NoteItem";
import { Link } from "react-router-dom";
import { useTasksStore } from "../../components/features/Tasks/stores/tasks";
import ListCardItem from "../../components/features/Tasks/components/Lists/ListCardItem";
import { useSession } from "../../lib/auth-client";

import { useTasks } from "../../components/features/Tasks/hooks/useTasks";

function Dashboard() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };
  const { data: session } = useSession();

  const { data: tasks } = useTasks();



  const Taskslists = useTasksStore((s) => s.lists);
  const Notes = useNotesStore((state) => state.filteredNotes);

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-1 px-1">
        <h1 className="font-bold text-lg">
          {getGreeting()}, {session?.user.name}
        </h1>
      </div>
      <div className="glass py-3 px-4 ">
        <div className=" text-indigo-400 flex items-center gap-1">
          <Stars size={16} />
          <h5 className="text-indigo-400 font-medium text-base uppercase">
            AI daily plan
          </h5>
        </div>
        <p className="text-sm py-3">
          Welcome back, Roxana. Based on your current deadlines, I recommend
          starting with the Project Specs review. You have a 2-hour deep work
          window before your sync with the Design Team. Focus on high-impact
          tasks first to maintain momentum.
        </p>
        <div className="flex gap-2 py-2">
          <Button size="xs" className=" cursor-pointer">
            Apply plan
          </Button>
          <Button size="xs" variant="outline" className=" cursor-pointer">
            Adjust Plan with AI
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4 md:col-span-3">
          <div className="glass py-3 px-4 h-full">
            <Tabs defaultValue="today" className="">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-base mb-2">Upcoming Tasks</h2>
                <div className="flex items-center gap-2">
                  <TabsList >
                    <TabsTrigger value="today">
                      <span className="text-xs">Today</span>
                    </TabsTrigger>
                    <TabsTrigger value="week">
                      <span className="text-xs">This Week</span>
                    </TabsTrigger>
                  </TabsList>
                  {/* <Button size="icon-xs" title="add task" variant="outline"><Plus size={12}/> </Button> */}
                </div>
              </div>

              <TabsContent value="today">
                {tasks?.length ? (
                  tasks.slice(0,3).map((task) => (
                    <TaskItemSummery key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-3">
                    No tasks available.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="week">
                {tasks?.length ? (
                   tasks.slice(0,3).map((task) => (
                    <TaskItemSummery key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No tasks available.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="col-span-4 md:col-span-1">
          <div className="glass py-3 px-4 h-full flex flex-col">
            <div className="flex gap-2 items-center px-1  mb-2">
              <Timer size={16} />
              <h2 className="font-medium text-base">Focus Timer</h2>
            </div>
            <div className="py-3 mb-3 grow flex flex-col justify-center">
              <span className="text-6xl text-center block font-bold tracking-tight  ">
                25:00
              </span>
              <span className="block text-center text-sm text-centertext-xs text-muted-foreground mt-2 uppercase tracking-[0.2em] ">
                Deep Work Session
              </span>
            </div>
            <div className="flex gap-2 py-2">
              <Button size="sm" className="grow cursor-pointer">
                Start Session
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                className=" cursor-pointer"
              >
                <RefreshCw />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className=" py-3 h-full">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-medium text-base mb-2">Projects</h2>
          <Link to={"/lists"}>
            <Button size="sm" variant="ghost">
              <span className="text-xs">View All</span>
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
          {Taskslists?.length && Taskslists.slice(0, 4).map((list) => (
            <ListCardItem key={list.id} list={list} className="" />
          ))}
        </div>
      </div>
      <div className="py-3  h-full">
        <div className="flex justify-between items-center px-1">
          <h2 className="font-medium text-base mb-2">Latest Notes</h2>
          <Link to={"/notes"}>
            <Button size="sm" variant="ghost">
              <span className="text-xs">View All</span>
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 py-2">
          {Notes.slice(0, 4).map((note) => (
            <NoteItem key={note.id} note={note} className="" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
