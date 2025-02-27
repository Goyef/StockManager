"use client";

import * as React from "react";
import {
  CircleHelp,
  GraduationCap,
  LifeBuoy,
} from "lucide-react";

import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
   
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user, loading,utilisateur } = useAuth();

  if (loading) return <p>Chargement...</p>;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              onClick={() => router.push("/dashboard")}
            >
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AP3</span>
                  <span className="truncate text-xs">Isitech</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        
        {/* <NavMain/> */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/commandes")}
        >
          Commandes
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/pendingCommandes")}
        >
          Commandes en attente
        </button>
      
        <button type="button" onClick={() => router.push("/dashboard/stocks")}>
          Stocks
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/mouvements")}
        >
          Mouvements
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/utilisateurs")}
        >
          Promotion de rôles utilisateur
        </button>
       
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}