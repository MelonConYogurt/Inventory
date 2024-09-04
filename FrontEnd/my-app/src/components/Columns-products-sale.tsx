"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";
import {Button} from "./ui/button";

export type sales = {
  sale_products_id: number;
  sale_id: string;
  product_id: number;
  quantity: number;
  product_price_at_sale: number;
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
          Sale id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "product_id",
    header: "Product id",
  },
  {
    accessorKey: "sale_date",
    header: "Sale date",
  },
  {
    accessorKey: "quantity",
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
  },
  {
    accessorKey: "product_price_at_sale",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price at sale
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => {
      const price = row.getValue("product_price_at_sale");
      if (typeof price !== "number") {
        return <div className="font-medium">Invalid price</div>;
      }
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(price);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "sale_products_id",
    header: "Sale products id",
  },
];
