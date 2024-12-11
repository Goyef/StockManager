// "use client";

// import { useState } from "react";
// import { Booking } from "@prisma/client";
// import { useQuery } from "@tanstack/react-query";

// const BookingList = () => {

//   const { data: bookings, isLoading, error, refetch } = useQuery<Booking[], Error>({
//     queryKey: ["bookings"],
//     queryFn: () =>
//       fetch("/api/bookings").then((res) => res.json()),
//   });

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div>
//       <h1>Users List</h1>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings && bookings.map((booking) => (
//             <tr key={booking.id}>
//               <td>{booking.apartmentId}</td>
//               <td>{booking.userId}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BookingList;

import { useQuery } from "@tanstack/react-query";
import { Booking, User, Apartment } from "@prisma/client";

export type BookingWithRelations = Booking & {
    user: User;
    apartment: Apartment;
};

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
    
export default function BookingList() {

    const { data: bookings, isLoading, error, refetch } = useQuery<BookingWithRelations[], Error>({
        queryKey: ["bookings"],
        queryFn: () =>
        fetch("/api/bookings").then((res) => res.json()),
    });

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.user.name}</TableCell>
              <TableCell>{booking.apartment.name}</TableCell>
              <TableCell>{booking.startDate.toLocaleString()}</TableCell>
              <TableCell>{booking.endDate.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
