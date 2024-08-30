"use client";

import * as React from "react";
import {Moon, Sun, MonitorCog} from "lucide-react";
import {useTheme} from "next-themes";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const [position, setPosition] = React.useState("bottom");
  const {setTheme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-xl dark:bg-zinc-900">
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto rounded-xl dark:bg-zinc-800">
        <DropdownMenuLabel>Choose a theme</DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-slate-950" />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem
            value="top"
            onClick={() => setTheme("light")}
            className="dark:hover:bg-zinc-700 rounded-xl"
          >
            <Sun size={18} className="mr-2" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="bottom"
            onClick={() => setTheme("dark")}
            className="dark:hover:bg-zinc-700 rounded-xl"
          >
            <Moon size={18} className="mr-2" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="right"
            onClick={() => setTheme("system")}
            className="dark:hover:bg-zinc-700 rounded-xl"
          >
            <MonitorCog size={18} className="mr-2" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
