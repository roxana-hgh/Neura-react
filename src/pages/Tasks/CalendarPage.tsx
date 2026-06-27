import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "../../types/Tasks";
import { useCalendarTasks } from "../../components/features/Tasks/hooks/useCalendarTasks";
import { Button } from "../../components/ui/button";
import { DayTasksModal } from "../../components/features/Tasks/components/DayTasksModal";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getTasksForDay(tasks: Task[], day: Date): Task[] {
  return tasks.filter((t) => {
    if (!t.due_date) return false;
    return isSameDay(new Date(t.due_date), day);
  });
}

// Soft pastel palette — 6 colors, cycles by task position in the day
const PILL_COLORS = [
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
];

function PriorityPill({ task, index }: { task: Task; index: number }) {
  const color = PILL_COLORS[index % PILL_COLORS.length];
  return (
    <div
      className={[
        "text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate max-w-full leading-tight",
        color,
        task.completed ? "opacity-40 line-through" : "",
      ].join(" ")}
    >
      {task.title}
    </div>
  );
}

export function CalendarPage() {
  const { data: tasks = [], isLoading } = useCalendarTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Build the full grid — always Mon-start, 6 rows max
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDayTasks = useMemo<Task[]>(() => {
    if (!selectedDate) return [];
    return getTasksForDay(tasks, selectedDate);
  }, [selectedDate, tasks]);

  const prevMonth = () =>
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => setCurrentMonth(new Date());

  return (
    <div className="p-6 h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground flex-1">
          {format(currentMonth, "MMMM yyyy")}
        </h1>
        <Button variant="outline" size="sm" onClick={goToday}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </Button>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-border overflow-hidden bg-card">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((day, i) => {
              const dayTasks = getTasksForDay(tasks, day);
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const selected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={[
                    "flex flex-col gap-0.5 p-2 text-left border-b border-r border-border/50 min-h-20",
                    "hover:bg-muted/30 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    !inMonth ? "opacity-25" : "",
                    today ? "border-l-2 border-l-primary bg-primary/5" : "", // ← today accent
                    selected ? "bg-muted/40" : "",
                  ].join(" ")}
                >
                  {/* Day number */}
                  <span
                    className={[
                      "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1",
                      today
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Task pills — max 2, then +N */}
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                    {dayTasks.slice(0, 2).map((t, i) => (
                      <PriorityPill key={t.id} task={t} index={i} />
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[10px] text-muted-foreground pl-1">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <DayTasksModal
        open={!!selectedDate}
        date={selectedDate ?? new Date()}
        tasks={selectedDayTasks}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
