"use client";

import * as React from "react";
import {
  Home,
  FolderIcon as FolderVideo,
  FileVideo,
  Plus,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";


export function ApplicationSidebar() {
  return (
    <Sidebar className="border-r" style={{ paddingTop: "80px" }}>
      <SidebarContent>
        <div className="space-y-4 px-2 py-3">
          <Button className="w-full bg-[#7559FF] text-white hover:bg-[#7559FF]/90">
            <Plus className="mr-2 h-4 w-4" />
            Create video
          </Button>
          <Button variant="outline" className="w-full">
            💎100
          </Button>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Home className="mr-2 h-4 w-4" />
              <Link href="/dashboard">Home</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FolderVideo className="mr-2 h-4 w-4" />
              <Link href="/dashboard/addProduct">Add Product</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FileVideo className="mr-2 h-4 w-4" />
              <Link href="/dashboard/ProductManagement">Product Management</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full">
          Pricing
        </Button>
        <div className="mt-4"></div>
      </SidebarFooter>
    </Sidebar>
  );
}
