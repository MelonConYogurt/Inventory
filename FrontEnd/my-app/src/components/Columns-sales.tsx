"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";
import {Button} from "./ui/button";

export type sales = {
  sale_id: string;
  sale_code: string;
  sale_date: string;
  sale_total: string;
};

export const columns: ColumnDef<sales>[] = [
  {
    accessorKey: "sale_id",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sale_code",
    header: "Code",
  },
  {
    accessorKey: "sale_date",
    header: "Sale date",
  },
  {
    accessorKey: "sale_total",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sale total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => {
      const price = row.getValue("price");
      if (typeof price !== "number") {
        return <div className="font-medium">Invalid price</div>;
      }
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
