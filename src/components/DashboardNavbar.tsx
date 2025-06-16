"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import DashBoardCmd from "./DashBoardCmd";

function DashboardNavbar() {
  const { state, toggleSidebar, isMobile } = useSidebar();

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsopen((e) => !e);
      }
    };

    document.addEventListener("keydown", key);

    return () => document.removeEventListener("keydown", key);
  }, []);
  const [isOpen, setIsopen] = useState(false);
  return (
    <>
      <DashBoardCmd open={isOpen} setOpen={setIsopen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background ">
        <Button className="size-9 " variant={"outline"} onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon />
          ) : (
            <PanelLeftCloseIcon />
          )}
        </Button>
        <Button
          size={"sm"}
          onClick={() => setIsopen((e) => !e)}
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground  hover:text-muted-foreground"
          variant={"outline"}
        >
          <SearchIcon />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none  items-center gap-1  rounded border bg-muted px-1.5 font-mono text-[10px ] font-medium text-muted-foreground ">
            <span
              className=" text-xs
          "
            >
              &#8984;
            </span>
            K
          </kbd>
        </Button>
      </nav>
    </>
  );
}

export default DashboardNavbar;
