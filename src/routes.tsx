import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import TasksPage from "./pages/Tasks/Tasks";
import AllLists from "./pages/Tasks/lists/AllLists";
import SingleList from "./pages/Tasks/lists/SingleList";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout /> ,
    children: [
     {index: true, element: <Dashboard />},
     {path: "tasks", element: <TasksPage />},
      {path: "lists", element: <AllLists/> },
      {path: "list/:id", element: <SingleList/> },
    ],
  }
]);