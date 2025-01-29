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

import { Input } from "../ui/input";

// Schéma Zod pour le formulaire Commande
export const StockFormSchema = z.object({
  type: z.string().min(1, {
    message: "Veuillez sélectionner un type.",
  }),
  nom: z.string({
    required_error: "Veuillez entrer un nom.",
  }),
  description: z.string({
    message: "Veuillez entre une description.",
  }),
});

export function StockForm({
  onFormSubmit,
}: {
  onFormSubmit?: (data: z.infer<typeof StockFormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof StockFormSchema>>({
    resolver: zodResolver(StockFormSchema),
    defaultValues: {
      type: "",
      nom: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof StockFormSchema>) {
    console.log("data", data);
    if (onFormSubmit) {
      onFormSubmit(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="medicament" value="medicament">
                      médicament
                    </SelectItem>
                    <SelectItem key="materiel" value="materiel">
                      matériel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choisissez le type pour ce stock.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Quantité</FormLabel>
              <Input type="text" {...field} />
              <FormDescription>
                Indiquez le nom du nouveau stock.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
              <Input type="text" {...field} />
              <FormDescription>
                Indiquez la description du nouveau stock.
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
