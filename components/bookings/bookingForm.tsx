"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

// Schéma Zod pour le formulaire Booking
export const BookingFormSchema = z.object({
  startDate: z.date({
    required_error: "La date d'entrée est obligatoire.",
  }),
  endDate: z.date({
    required_error: "La date de sortie est obligatoire.",
  }),
  apartmentId: z.string().min(1, {
    message: "Veuillez sélectionner un appartement.",
  }),
  userId: z.string().min(1, {
    message: "Veuillez sélectionner un utilisateur.",
  }),
})

// Types pour les données
type User = {
  id: string
  name: string
}

type Apartment = {
  id: string
  name: string
}

export function BookingForm({ onFormSubmit }: { onFormSubmit?: (data: z.infer<typeof BookingFormSchema>) => void }) {

  // Récupération des appartements via useQuery
  const {
    data: apartments = [],
    isLoading: isLoadingApartments,
    error: errorApartments,
  } = useQuery<Apartment[], Error>({
    queryKey: ["apartments"],
    queryFn: () => fetch("/api/apartments").then((res) => res.json()),
  })

  // Récupération des utilisateurs via useQuery
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  })

  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      apartmentId: "",
      userId: "",
    },
  })

  function onSubmit(data: z.infer<typeof BookingFormSchema>) {
    if (onFormSubmit) {
      onFormSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* Date d'entrée */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date d'entrée</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Sélectionnez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("2000-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Indiquez la date de début de la réservation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date de sortie */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de sortie</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Sélectionnez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("2000-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Indiquez la date de fin de la réservation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Appartement */}
        <FormField
          control={form.control}
          name="apartmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appartement</FormLabel>
              <FormControl>
                {isLoadingApartments ? (
                  <p>Chargement des appartements...</p>
                ) : errorApartments ? (
                  <p>Erreur lors du chargement des appartements.</p>
                ) : (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un appartement" />
                    </SelectTrigger>
                    <SelectContent>
                      {apartments.map((apartment) => (
                        <SelectItem key={apartment.id} value={apartment.id}>
                          {apartment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormDescription>
                Choisissez l'appartement pour cette réservation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Utilisateur */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Utilisateur</FormLabel>
              <FormControl>
                {isLoadingUsers ? (
                  <p>Chargement des utilisateurs...</p>
                ) : errorUsers ? (
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
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormDescription>
                Choisissez l'utilisateur pour cette réservation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  )
}