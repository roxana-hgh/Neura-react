import { useQuery } from "@tanstack/react-query";
import type { Task } from "../../../../types/Tasks";
import { api } from "../../../../lib/api";


export function useCalendarTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks", "calendar"],
    queryFn: async () => {
      const res = await api.get("/tasks/calendar");
      // API returns camelCase dueDate, client type uses due_date — map here
      return res.data.map((t: Task & { dueDate?: string }) => ({
        ...t,
        due_date: t.dueDate ?? null,
      }));
    },
  });
}