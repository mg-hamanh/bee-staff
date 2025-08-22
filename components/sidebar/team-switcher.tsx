"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TeamSwitcher() {
  return (
    <div className="flex items-center justify-between w-full  group ">
      {/* Logo + Text */}
      <div className="flex  items-center gap-2 transition-all duration-200 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0 overflow-hidden">
        {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex w-8 h-8 items-center justify-center rounded-lg shrink-0"> */}
        <GalleryVerticalEnd className="w-4 h-4 " />
        {/* </div> */}
        <div className="flex flex-col text-sm leading-tight">
          <span className="truncate font-medium">BeeAdmin</span>
          <span className="truncate text-xs">Enterprise</span>
        </div>
      </div>
      {/* Trigger luôn hiện */}
      <SidebarTrigger className="group-data-[collapsed=true]:w-full" />
    </div>
  );
}
