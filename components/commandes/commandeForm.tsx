"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { util, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SerializedStocks } from "@/services/stockService";
import { SerializedUtilisateurs } from "@/services/utilsateursService";
import { Input } from "../ui/input";

// Schéma Zod pour le formulaire Commande
export const CommandeFormSchema = z.object({
  utilisateurId: z.string().min(1, {
    message: "Veuillez sélectionner un utilisateur.",
  }),
  quantite: z.string().refine(
    (value) => {
      const numValue = Number(value);
      return !isNaN(numValue) && numValue > 0;
    },
    {
      message: "Veuillez entrer une quantité positive.",
    }
  ),
  stockId: z.string({
    required_error: "Veuillez sélectionner un stock.",
  }),
});

// Types pour les données
type Utilisateur = {
  id: bigint;
  nom: string;
};

type Stock = {
  id: bigint;
  nom: string;
};

export function CommandeForm({
  onFormSubmit,
}: {
  onFormSubmit?: (data: z.infer<typeof CommandeFormSchema>) => void;
}) {
  // Récupération des appartements via useQuery
  const {
    data: stocks = [],
    isLoading: isLoadingStocks,
    error: errorStocks,
  } = useQuery<SerializedStocks[], Error>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((res) => res.json()),
  });

  // Récupération des utilisateurs via useQuery
  const {
    data: utilisateurs = [],
    isLoading: isLoadingUtilisateurs,
    error: errorUtilisateurs,
  } = useQuery<SerializedUtilisateurs[], Error>({
    queryKey: ["utilisateurs"],
    queryFn: () => fetch("/api/utilisateurs").then((res) => res.json()),
  });

  const form = useForm<z.infer<typeof CommandeFormSchema>>({
    resolver: zodResolver(CommandeFormSchema),
    defaultValues: {
      utilisateurId: "",
      quantite: "",
      stockId: "",
    },
  });

  function onSubmit(data: z.infer<typeof CommandeFormSchema>) {
    if (onFormSubmit) {
      onFormSubmit(data);
    }
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="utilisateurId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Utilisateur</FormLabel>
            <FormControl>
              {isLoadingUtilisateurs ? (
                <p>Chargement des utilisateurs...</p>
              ) : errorUtilisateurs ? (
                <p>Erreur lors du chargement des utilisateurs.</p>
              ) : (
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {utilisateurs.map((utilisateur) => (
                      <SelectItem
                        key={utilisateur.id_utilisateur}
                        value={utilisateur.id_utilisateur.toString()}
                      >
                        {utilisateur.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormControl>
            <FormDescription>
              Choisissez l'utilisateur pour cette commande.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="quantite"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Quantité</FormLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;

                  if (
                    value === "" ||
                    (Number(value) > 0 && !isNaN(Number(value)))
                  ) {
                    field.onChange(value);
                  }
                }}
              />
              <FormDescription>
                Indiquez la quantité de la commande.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stockId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock concerné</FormLabel>
              <FormControl>
                {isLoadingStocks ? (
                  <p>Chargement des stocks...</p>
                ) : errorStocks ? (
                  <p>Erreur lors du chargement des stocks.</p>
                ) : (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stocks.map((stock) => (
                        <SelectItem
                          key={stock.id_stock}
                          value={stock.id_stock.toString()}
                        >
                          {stock.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormDescription>
                Choisissez le stock pour cette commande.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  );
}
