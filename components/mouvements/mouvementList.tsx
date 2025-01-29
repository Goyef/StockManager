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
import { commandes, stocks, utilisateurs } from "@prisma/client";
import { SerializedCommandes } from "@/services/commandeService";
import { comma } from "postcss/lib/list";
import { SerializedMouvements } from "@/services/mouvementService";

export type MouvementWithRelations = SerializedMouvements & {
  commandes: commandes;
  stocks: stocks;
  utilisateurs: utilisateurs;
};

export type MouvementListRef = {
  refresh: () => void;
};

const MouvementList = forwardRef<MouvementListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupération des stocks
  const {
    data: mouvements,
    isLoading,
    error,
    refetch,
  } = useQuery<MouvementWithRelations[], Error>({
    queryKey: ["mouvements"],
    queryFn: () => fetch("/api/mouvements").then((res) => res.json()),
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
          <TableHead>Statut</TableHead>
          <TableHead>Date de la commande</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Utilisateur liée</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mouvements &&
          mouvements?.length > 0 &&
          mouvements.map((mouvement) => (
            <TableRow key={mouvement.id_mouvement}>
              <TableCell>{mouvement.stocks.nom}</TableCell>
              <TableCell>{mouvement.type_mouvement}</TableCell>
              <TableCell>
                {new Date(mouvement.date_mouvement).toLocaleString()}
              </TableCell>
              <TableHead>{mouvement.quantite}</TableHead>
              <TableCell>{mouvement.utilisateurs.nom}</TableCell>
            </TableRow>
          ))}
        {(!mouvements || mouvements?.length === 0) && (
          <TableRow>
            <TableCell>Erreur</TableCell>
            <TableCell>Absence de mouvements</TableCell>
            <TableCell>0</TableCell>
            <TableCell>N/A</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

MouvementList.displayName = "MouvementList";

export default MouvementList;
