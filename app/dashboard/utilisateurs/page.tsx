"use client";

import { useRef, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

import UtilisateursList, {
  UtilisateurListRef,
} from "@/components/utilisateurs/utilisateursList";

export default function Page() {
  const { user, loading, utilisateur } = useAuth();

  const UtilisateursListRef = useRef<UtilisateurListRef>(null);

  if (loading) return <p>Chargement...</p>;

  const userType = String(utilisateur?.id_role)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Mettre admin les Utilisateurs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {userType !== '1' && (
          <div> Seul les administrateurs peuvent effectuer des actions ici </div>
        )}
        {userType === '1' && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between">
                  <h2>Utilisateurs</h2>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UtilisateursList ref={UtilisateursListRef} />
            </CardContent>
          </Card>
        </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
