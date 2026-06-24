import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import TasksPage from "./pages/Tasks/Tasks";
import AllLists from "./pages/Tasks/lists/AllLists";
import SingleList from "./pages/Tasks/lists/SingleList";
import AllNotesPage from "./pages/Notes/AllNotes";
import SingleNotes from "./pages/Notes/SingleNotePage";
import FocusTimerPage from "./pages/Focus/FocusTimerPage";
import LoginPage from "./pages/Auth/loginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import AddEditNotePage from "./pages/Notes/AddEditNote";
import ProtectedRoute from "./components/features/user/ProtectedRoute";
import GuestRoute from "./components/features/user/GuestRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "lists", element: <AllLists /> },
      { path: "list/:id", element: <SingleList /> },
      { path: "notes", element: <AllNotesPage /> },
      { path: "note/:id", element: <SingleNotes /> },
      { path: "notes/add", element: <AddEditNotePage /> },
      { path: "note/:id/edit", element: <AddEditNotePage /> },
      { path: "focus", element: <FocusTimerPage /> },
    ],
  },
  {
    path: "login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "signup",
    element: (
      <GuestRoute>
        <SignUpPage />
      </GuestRoute>
    ),
  },
]);