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
import { commandes, roles, stocks, utilisateurs } from "@prisma/client";
import { SerializedCommandes } from "@/services/commandeService";
import { SerializedUtilisateurs } from "@/services/utilisateurService";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export type UtilisateursWithRelations = SerializedUtilisateurs & {
  roles: roles;
};

export type UtilisateurListRef = {
  refresh: () => void;
};

const UtilisateursList = forwardRef<UtilisateurListRef>((_, ref) => {
  // Récupération des stocks
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    data: utilisateurs,
    isLoading,
    error,
    refetch,
  } = useQuery<UtilisateursWithRelations[], Error>({
    queryKey: ["upgradeUtilisateurs"],
    queryFn: () => fetch("/api/upgradeUtilisateurs").then((res) => res.json()),
  });

  const updateUtilisateurMutation = useMutation({
    mutationFn: async (id_utilisateur: number) => {
      const response = await fetch(
        `/api/upgradeUtilisateurs/${id_utilisateur}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la mise à jour du statut de l'utilisateur."
        );
      }
      return { id_utilisateur: id_utilisateur };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["upgradeUtilisateurs"] });
      toast({
        title: "Success",
        description: `Role de l'utilisateur  ${data.id_utilisateur} mis à jour en admin`,
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
          <TableHead>Nom</TableHead>
          <TableHead>Prenom</TableHead>
          <TableHead>Mail</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {utilisateurs &&
          utilisateurs?.length > 0 &&
          utilisateurs.map((utilisateur) => (
            <TableRow key={utilisateur.id_utilisateur}>
              <TableCell>{utilisateur.nom}</TableCell>
              <TableCell>{utilisateur.prenom}</TableCell>
              <TableHead>{utilisateur.email}</TableHead>
              <TableCell>{utilisateur.roles.nom_role}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() =>
                      updateUtilisateurMutation.mutate(
                        utilisateur.id_utilisateur
                      )
                    }
                  >
                    Mettre admin
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        {(!utilisateurs || utilisateurs?.length === 0) && (
          <TableRow>
            <TableCell>Erreur</TableCell>
            <TableCell>Absence de données</TableCell>
            <TableCell>0</TableCell>
            <TableCell>N/A</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

UtilisateursList.displayName = "UtilisateursList";

export default UtilisateursList;
