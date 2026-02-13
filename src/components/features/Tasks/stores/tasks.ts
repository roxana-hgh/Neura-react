
import { create } from "zustand";
import type { Task, TaskList } from "../../../../types/Tasks";


// ─────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────

export interface TaskStoreState {
  // ── Core data ──────────────────────────────
  tasks: Task[];
  lists: TaskList[];

  // ── Filter state ───────────────────────────
  search: string;
  priorities: Set<string>;

  // ── Derived / cached ───────────────────────
  filteredTasks: Task[];

  // ── Task actions ───────────────────────────
  addTask: (task: Task) => void;
  removeTask: (id: string | number) => void;
  updateTask: (id: string | number, updates: Partial<Task>) => void;
  toggleTask: (id: string | number, completed: boolean) => void;
  toggleSubTask: (
    taskId: string | number,
    subTaskId: string | number,
    completed: boolean
  ) => void;

  // ── List actions ───────────────────────────
  addList: (list: TaskList) => void;
  removeList: (id: string | number) => void;
  updateList: (id: string | number, updates: Partial<TaskList>) => void;

  // ── Filter actions ─────────────────────────
  setSearch: (value: string) => void;
  togglePriority: (priority: string) => void;
  clearFilters: () => void;

  // ── Derived selectors (call in components) ─
  // getTasksByList: (listId: string | number) => Task[];
  // getUnassignedTasks: () => Task[];
  // getAllTasksSortedByDueDate: () => TaskWithListName[];
}


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Build a fast id→name lookup map from the lists array (O(1) per access) */
// const buildListMap = (lists: TaskList[]): Map<string | number, string> =>
//   new Map(lists.map((l) => [l.id, l.name]));

/** Core filter logic, kept pure so it can be called from any action */
const applyFilters = (
  tasks: Task[],
  search: string,
  priorities: Set<string>
): Task[] =>
  tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (priorities.size === 0) return true;

    return priorities.has(task.priority);
  });


// ─────────────────────────────────────────────
// INITIAL DATA  (replace with API calls later)
// ─────────────────────────────────────────────

const initialLists: TaskList[] = [
  { id: 1, name: "Work" , color: "blue" },
  { id: 2, name: "Personal", color:"red" },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Task 1",
    completed: false,
    created_at: "2025-12-12",
    due_date: "2026-02-15",
    priority: "high",
    description: "this is some random detail for this task",
    list_id: 1, // belongs to "Work"
    subtasks: [
      { id: 1, title: "subtask title 1", completed: false },
      { id: 2, title: "subtask title 2", completed: true },
      { id: 3, title: "subtask title 3", completed: false },
    ],
  },
  {
    id: 2,
    title: "Task 2",
    completed: true,
    created_at: "2025-12-12",
    due_date: "2026-02-21",
    priority: "medium",
    description: "",
    list_id: 1, // belongs to "Work"
    subtasks: [],
  },
  {
    id: 3,
    title: "Task 3",
    completed: false,
    created_at: "2025-12-12",
    due_date: "2026-03-02",
    priority: "medium",
    description:
      "this is some random detail for this task\n  detail one\n  detail two\n  detail three",
    list_id: 2, // belongs to "Personal"
    subtasks: [],
  },
  {
    id: 4,
    title: "Task 4",
    completed: false,
    created_at: "2025-12-12",
    due_date: "2026-02-07",
    priority: "low",
    description: "",
    list_id: null, // not assigned to any list
    subtasks: [],
  },
];

// ─────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────

export const useTasksStore = create<TaskStoreState>((set) => ({
  // ── Initial state ──────────────────────────
  tasks: initialTasks,
  lists: initialLists,
  search: "",
  priorities: new Set<string>(),
  filteredTasks: initialTasks,

  // ── Task actions ───────────────────────────

  addTask: (task) =>
    set((state) => {
      const tasks = [...state.tasks, task];
      return {
        tasks,
        filteredTasks: applyFilters(tasks, state.search, state.priorities),
      };
    }),

  removeTask: (id) =>
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id);
      return {
        tasks,
        filteredTasks: applyFilters(tasks, state.search, state.priorities),
      };
    }),

  updateTask: (id, updates) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      return {
        tasks,
        filteredTasks: applyFilters(tasks, state.search, state.priorities),
      };
    }),

  toggleTask: (id, completed) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, completed } : t
      );
      return {
        tasks,
        filteredTasks: applyFilters(tasks, state.search, state.priorities),
      };
    }),

  toggleSubTask: (taskId, subTaskId, completed) =>
    set((state) => {
      const tasks = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks:
            t.subtasks?.map((s) =>
              s.id === subTaskId ? { ...s, completed } : s
            ) ?? null,
        };
      });
      return {
        tasks,
        filteredTasks: applyFilters(tasks, state.search, state.priorities),
      };
    }),

  // ── List actions ───────────────────────────

  addList: (list) =>
    set((state) => ({ lists: [...state.lists, list] })),

  removeList: (id) =>
    set((state) => {
      const lists = state.lists.filter((l) => l.id !== id);
      // Detach tasks that belonged to the removed list
      const tasks = state.tasks.map((t) =>
        t.list_id === id ? { ...t, list_id: null } : t
      );
      return {
        lists,
        tasks,
        filteredTasks: applyFilters(tasks, state.search, state.priorities),
      };
    }),

  updateList: (id, updates) =>
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),

  // ── Filter actions ─────────────────────────

  setSearch: (value) =>
    set((state) => ({
      search: value,
      filteredTasks: applyFilters(state.tasks, value, state.priorities),
    })),

  togglePriority: (priority) =>
    set((state) => {
      const priorities = new Set(state.priorities);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      priorities.has(priority)
        ? priorities.delete(priority)
        : priorities.add(priority);
      return {
        priorities,
        filteredTasks: applyFilters(state.tasks, state.search, priorities),
      };
    }),

  clearFilters: () =>
    set((state) => {
      const priorities = new Set<string>();
      return {
        search: "",
        priorities,
        filteredTasks: applyFilters(state.tasks, "", priorities),
      };
    }),

  // // ── Derived selectors ──────────────────────

  // /** All tasks belonging to a specific list */
  // getTasksByList: (listId) =>
  //   get().tasks.filter((t) => t.list_id === listId),

  // /** Tasks not assigned to any list */
  // getUnassignedTasks: () =>
  //   get().tasks.filter((t) => t.list_id === null),

  // /**
  //  * All tasks sorted by due_date (nulls last),
  //  * each enriched with the name of its parent list.
  //  * Use this for the "All Tasks" page.
  //  */
  // getAllTasksSortedByDueDate: (): TaskWithListName[] => {
  //   const { tasks, lists } = get();
  //   const listMap = buildListMap(lists);

  //   return [...tasks]
  //     .sort((a, b) => {
  //       if (!a.due_date && !b.due_date) return 0;
  //       if (!a.due_date) return 1;
  //       if (!b.due_date) return -1;
  //       return (
  //         new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  //       );
  //     })
  //     .map((task) => ({
  //       ...task,
  //       listName: task.list_id != null ? (listMap.get(task.list_id) ?? null) : null,
  //     }));
  // },
}));
