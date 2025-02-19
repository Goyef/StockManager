import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stocks, utilisateurs } from "@prisma/client";
import { SerializedCommandes } from "@/services/commandeService";
import { useAuth } from "@/context/AuthContext";

export type CommandeWithRelations = SerializedCommandes & {
  utilisateurs: utilisateurs;
  stocks: stocks;
};

export type CommandeListRef = {
  refresh: () => void;
};

const CommandeList = forwardRef<CommandeListRef>((_, ref) => {
 
  const { toast } = useToast();
  const { user,loading,utilisateur } = useAuth();

  const {
    data: commandes,
    isLoading,
    error,
    refetch,
  } = useQuery<CommandeWithRelations[], Error>({
    queryKey: ["commandes",utilisateur?.id_utilisateur],
    queryFn: () => fetch(`/api/commandes?email=${utilisateur?.email}`).then((res) => res.json()),
  });

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/commandes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Commande supprimée avec succès",
        });
        refetch();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };
  // Expose la méthode `refresh` au composant parent
  useImperativeHandle(ref, () => ({
    refresh: refetch,
  }));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur liée</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date de la commande</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commandes &&
          commandes?.length > 0 &&
          commandes.map((commande) => (
            <TableRow key={commande.id_commande}>
              <TableCell>{commande.utilisateurs.nom}</TableCell>
              <TableCell
                className={
                  String(commande.statut) === "validee"
                    ? "text-green-500"
                    : String(commande.statut) === "invalidee"
                    ? "text-red-500"
                    : ""
                }
              >
                {commande.statut}
              </TableCell>
              <TableCell>
                {new Date(commande.date_commande).toLocaleString()}
              </TableCell>
              <TableHead>{commande.quantite}</TableHead>
              <TableCell>{commande.stocks.nom}</TableCell>
              <TableCell>
                {String(commande.statut) === "en_attente" && (
                  <div className="flex space-x-2">
                   
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(commande.id_commande)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        {(!commandes || commandes?.length === 0) && (
          <TableRow>
            <TableCell>Erreur</TableCell>
            <TableCell>Absence de commande</TableCell>
            <TableCell>0</TableCell>
            <TableCell>N/A</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

CommandeList.displayName = "CommandeList";

export default CommandeList;
