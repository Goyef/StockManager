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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { SerializedStocks } from "@/services/stockService";
import { Input } from "../ui/input";

// Schéma Zod pour le formulaire Commande
export const CommandeFormSchema = z.object({
  quantite: z.string().refine(
    (value) => {
      const numValue = Number(value);
      return !isNaN(numValue) && numValue > 0;
    },
    {
      message: "Veuillez entrer une quantité positive.",
    }
  ),
  id_stock: z.string().min(1, {
    message: "Veuillez sélectionner un stock.",
  }),
});

export function CommandeFormAdmin({
  onFormSubmit,
}: {
  onFormSubmit?: (data: z.infer<typeof CommandeFormSchema>) => void;
}) {
  const {
    data: stocks = [],
    isLoading: isLoadingStocks,
    error: errorStocks,
  } = useQuery<SerializedStocks[], Error>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((res) => res.json()),
  });


  const form = useForm<z.infer<typeof CommandeFormSchema>>({
    resolver: zodResolver(CommandeFormSchema),
    defaultValues: {
      quantite: "",
      id_stock: "",
    },
  });

  function onSubmit(data: z.infer<typeof CommandeFormSchema>) {
    if (onFormSubmit) {
      onFormSubmit(data);
    }
  }

  return (
    <Form {...form}>
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
          name="id_stock"
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
