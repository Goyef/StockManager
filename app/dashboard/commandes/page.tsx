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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import CommandeList, {
  CommandeListRef,
} from "@/components/commandes/commandesList";
import {
  CommandeForm,
  CommandeFormSchema,
} from "@/components/commandes/commandeForm";

export default function Page() {
  const { user, loading, utilisateur } = useAuth();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogCommandeOpen, setIsDialogCommandeOpen] = useState(false)

  const CommandeListRef = useRef<CommandeListRef>(null);

  const handleNewCommande = () => {
    setIsDialogOpen(true);
  };


  const handleNewCommandeAdmin = () => {
    setIsDialogCommandeOpen(true)
  }

  const handleFormSubmitAdmin = async (data: z.infer<typeof CommandeFormSchema>) => {
    try {
      const updateData = {
        ...data,
        id_utilisateur : utilisateur?.id_utilisateur 
      }
      await fetch("/api/commandesAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      setIsDialogCommandeOpen(false);
      toast({
        title: "Success",
        description: "Commande créée",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Commande non crée",
        variant: "destructive",
      });
      
    }
  };
  const handleFormSubmit = async (data: z.infer<typeof CommandeFormSchema>) => {
    try {
      const updateData = {
        ...data,
        id_utilisateur : utilisateur?.id_utilisateur 
      }
      await fetch("/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Commande créée",
        variant: "default",
      });
      CommandeListRef.current?.refresh();
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);
    }
  };

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
                  <BreadcrumbPage>Commandes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between">
                  <h2>Commandes sortie</h2>

                  {userType === '1' && (
                    <Dialog open={isDialogCommandeOpen} onOpenChange={setIsDialogCommandeOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleNewCommandeAdmin}>
                          <Plus /> Ajouter du stock (admin)
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className={cn(
                          "sm:max-w-[600px] w-full max-h-[90vh]",
                          "overflow-y-auto"
                        )}
                      >
                        <DialogHeader>
                          <DialogTitle>Nouvelle commande de stock admin</DialogTitle>
                        </DialogHeader>
                        <div className="grid py-4 gap-4">
                          <CommandeForm onFormSubmit={handleFormSubmitAdmin} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}


                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewCommande}>
                        <Plus /> Ajouter une commande
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={cn(
                        "sm:max-w-[600px] w-full max-h-[90vh]",
                        "overflow-y-auto"
                      )}
                    >
                      <DialogHeader>
                        <DialogTitle>Nouvelle commande</DialogTitle>
                      </DialogHeader>
                      <div className="grid py-4 gap-4">
                        <CommandeForm onFormSubmit={handleFormSubmit} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommandeList ref={CommandeListRef} />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
