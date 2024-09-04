"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";
import {Button} from "./ui/button";

export type sales = {
  name: string;
  phone: string;
  direction: string;
  nit: string;
  email: string;
  contact: string;
};

export const columns: ColumnDef<sales>[] = [
  {
    accessorKey: "name",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "direction",
    header: "Direction",
  },
  {
    accessorKey: "nit",
    header: "Nit",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
];
