import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useEffect, useState } from "react";

function Header() {
  const [isDarkTheme, setisDarkTheme] = useState(true);

  const OnToggleTheme = () => {
    setisDarkTheme((prev) => !prev);
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <header className="w-full flex justify-between p-2 border-b h-auto">
      <SidebarTrigger />

      <div className="px-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-xs"
          className="flex items-center cursor-pointer"
          asChild
          onClick={OnToggleTheme}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="size-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 3l0 18"></path>
            <path d="M12 9l4.65 -4.65"></path>
            <path d="M12 14.3l7.37 -7.37"></path>
            <path d="M12 19.6l8.85 -8.85"></path>
          </svg>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex items-center"
          asChild
        >
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}

export default Header;
