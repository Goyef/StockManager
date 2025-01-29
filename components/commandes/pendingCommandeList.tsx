import React, { forwardRef, useImperativeHandle } from "react";
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
import { comma } from "postcss/lib/list";

export type CommandeWithRelations = SerializedCommandes & {
  utilisateurs: utilisateurs;
  stocks: stocks;
};

export type PendingCommandeListRef = {
  refresh: () => void;
};

const PendingCommandeList = forwardRef<PendingCommandeListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: commandes,
    isLoading,
    error,
    refetch,
  } = useQuery<CommandeWithRelations[], Error>({
    queryKey: ["commandes"],
    queryFn: () => fetch("/api/pendingCommandes").then((res) => res.json()),
  });

  const validateCommandeMutation = useMutation({
    mutationFn: async (commandeId: number) => {
      const response = await fetch(`/api/commandes/${commandeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: "validee" }),
      });
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la mise à jour du statut de la commande."
        );
      }
      return { commandeId: commandeId, statut: "validee" };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      toast({
        title: "Success",
        description: `Statut de la commande ${data.commandeId} mis à jour en ${data.statut}`,
        variant: "default",
      });
    },
  });

  const invalidateCommandeMutation = useMutation({
    mutationFn: async (commandeId: number) => {
      const response = await fetch(`/api/commandes/${commandeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: "invalidee" }),
      });
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la mise à jour du statut de la commande."
        );
      }
      return { commandeId: commandeId, statut: "invalidee" };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      toast({
        title: "Success",
        description: `Statut de la commande ${data.commandeId} mis à jour en ${data.statut}`,
        variant: "default",
      });
    },
  });
  // test

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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commandes &&
          commandes.length > 0 &&
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
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      validateCommandeMutation.mutate(commande.id_commande)
                    }
                  >
                    Valider
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      invalidateCommandeMutation.mutate(commande.id_commande)
                    }
                  >
                    Invalider
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        {(!commandes || commandes.length === 0) && (
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

PendingCommandeList.displayName = "CommandeList";

export default PendingCommandeList;
