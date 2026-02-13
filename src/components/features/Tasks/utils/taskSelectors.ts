// utils/taskSelectors.ts
import { useMemo } from "react"
import { useTasksStore } from "../stores/tasks"
import type { TaskWithListName } from "../../../../types/Tasks"


export const useTasksByList = (listId: string | number) => {
  const tasks = useTasksStore(s => s.tasks)
  return useMemo(() => tasks.filter(t => t.list_id === listId), [tasks, listId])
}

export const useUnassignedTasks = () => {
  const tasks = useTasksStore(s => s.tasks)
  return useMemo(() => tasks.filter(t => t.list_id === null), [tasks])
}

export const useAllTasksSortedByDueDate = () => {
 // const tasks = useTasksStore(s => s.tasks)
  const lists = useTasksStore(s => s.lists)
  const filteredTasks = useTasksStore(s => s.filteredTasks)

  return useMemo((): TaskWithListName[] => {
    const listNameMap = new Map(lists.map(l => [l.id, l.name]))
    const listColorMap = new Map(lists.map(l => [l.id, l.color]))

    return [...filteredTasks]
      .sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })
      .map(task => ({
        ...task,
        listName: task.list_id != null ? (listNameMap.get(task.list_id) ?? null) : null,
        listColor: task.list_id != null ? (listColorMap.get(task.list_id) ?? "gray") : "gray",
      }))
  }, [filteredTasks, lists])
}