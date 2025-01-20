import React, { forwardRef, useImperativeHandle } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Booking, User, Apartment } from "@prisma/client";
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

export type BookingWithRelations = Booking & {
  user: User;
  apartment: Apartment;
};

export type BookingListRef = {
  refresh: () => void;
};

const BookingList = forwardRef<BookingListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupération des réservations
  const { data: bookings, isLoading, error, refetch } = useQuery<BookingWithRelations[], Error>({
    queryKey: ["bookings"],
    queryFn: () => fetch("/api/bookings").then((res) => res.json()),
  });

  // Mutation pour supprimer une réservation
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la réservation.");
      }
    },
    onSuccess: () => {
      // Rafraîchir la liste des réservations après la suppression
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: 'Success',
        description: 'Réservation supprimée',
        variant: 'default',
      });
    },
  });

  //
  const editBookingsMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la réservation.");
      }
    },
    onSuccess: () => {
      // Rafraîchir la liste des réservations après la suppression
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: 'Success',
        description: 'Réservation supprimée',
        variant: 'default',
      });
    },
  });
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
          <TableHead>Appartement</TableHead>
          <TableHead>Début de la réservation</TableHead>
          <TableHead>Fin de la réservation</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings?.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.user.name}</TableCell>
            <TableCell>{booking.apartment.name}</TableCell>
            <TableCell>{new Date(booking.startDate).toLocaleString()}</TableCell>
            <TableCell>{new Date(booking.endDate).toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex gap-3">
                <Button variant="outline" size="icon"   
                onClick={() => editBookingsMutation.mutate(booking.id)}>
                  <Pencil />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteBookingMutation.mutate(booking.id)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

BookingList.displayName = "BookingList";

export default BookingList;
