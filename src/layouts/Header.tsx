import { Button } from "../components/ui/button";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useEffect, useState } from "react";

import ProfileMenu from "./UserProfileMenu";

function Header() {
  const [isDarkTheme, setisDarkTheme] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const OnToggleTheme = () => {
    if (!isDarkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setisDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  return (
    <header className="w-full flex justify-between p-2 border-b h-auto">
      <SidebarTrigger />

      <div className="md:hidden">
        <div className="logo-sec flex items-center gap-2  ">
          <span className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold ">Neura</h2>
          </span>
        </div>
      </div>

      <div className="md:px-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-xs"
          className=" items-center cursor-pointer hidden md:flex"
          asChild
          onClick={OnToggleTheme}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
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

        <ProfileMenu />
      </div>
    </header>
  );
}

export default Header;
