"use client";
import {
  Home,
  FolderIcon as FolderVideo,
  FileVideo,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function ApplicationSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: FolderVideo, label: "Add Product", href: "/dashboard/addProduct" },
    {
      icon: FileVideo,
      label: "Product Management",
      href: "/dashboard/ProductManagement",
    },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <Sidebar className="border-r border-gray-800" collapsible="icon">
      <SidebarHeader className=" bg-gradient-to-r from-gray-900 to-gray-800 p-4">
        <Link href="/" className="flex items-center space-x-2 mt-20"></Link>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="transition-all duration-200 hover:bg-gray-700"
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-3"
                >
                  <item.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-gray-900 border-t border-gray-800 p-4">
        <Button
          variant="outline"
          className="w-full mb-4 bg-blue-600 text-white hover:bg-blue-700 border-none"
        >
          Upgrade to Pro
        </Button>
        <Button
          variant="ghost"
          className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
