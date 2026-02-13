import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../components/ui/sidebar";
import SidebarNav from "./Nav/SidebarNav";
import Header from "./Header";

function AppLayout() {
  return (
    <SidebarProvider>
      <SidebarNav />
      <div className="w-full">
       <Header />
        <main className="w-full px-6 py-6 container mx-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
