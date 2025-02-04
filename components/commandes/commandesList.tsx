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
import { comma } from "postcss/lib/list";
import { useAuth } from "@/context/AuthContext";

export type CommandeWithRelations = SerializedCommandes & {
  utilisateurs: utilisateurs;
  stocks: stocks;
};

export type CommandeListRef = {
  refresh: () => void;
};

const CommandeList = forwardRef<CommandeListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [editingCommande, setEditingCommande] =
    useState<CommandeWithRelations | null>(null);
  const [editData, setEditData] = useState({
    quantite: 0,
    date_commande: "",
    id_stock: 0,
  });

  const {
    data: commandes,
    isLoading,
    error,
    refetch,
  } = useQuery<CommandeWithRelations[], Error>({
    queryKey: ["commandes"],
    queryFn: () => fetch("/api/commandes").then((res) => res.json()),
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
