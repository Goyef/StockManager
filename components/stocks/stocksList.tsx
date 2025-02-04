import React, { forwardRef, useImperativeHandle } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Booking, User, Apartment, stocks } from "@prisma/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Pencil, Pill, Stethoscope, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SerializedStocks } from "@/services/stockService";

export type StockWithRelations = SerializedStocks;

export type StockListRef = {
  refresh: () => void;
};

const StockList = forwardRef<StockListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupération des stocks
  const {
    data: stocks,
    isLoading,
    error,
    refetch,
  } = useQuery<StockWithRelations[], Error>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((res) => res.json()),
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
          <TableHead>Description</TableHead>
          <TableHead>Quantité disponible</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks &&
          stocks?.length > 0 &&
          stocks.map((stock) => (
            <TableRow key={stock.id_stock}>
              <TableCell>{stock.nom}</TableCell>
              <TableCell>{stock.description}</TableCell>
              <TableCell>{stock.quantite_disponible}</TableCell>
              <TableCell>
                {stock.type}
                {String(stock.type) === "medicament" ? (
                  <Pill />
                ) : (
                  <Stethoscope />
                )}
              </TableCell>
            </TableRow>
          ))}
        {(!stocks || stocks?.length === 0) && (
          <TableRow>
            <TableCell>Erreur</TableCell>
            <TableCell>Absence de stock</TableCell>
            <TableCell>0</TableCell>
            <TableCell>N/A</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
});

StockList.displayName = "StockList";

export default StockList;
