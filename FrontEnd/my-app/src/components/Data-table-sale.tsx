"use client";

import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast, Toaster} from "sonner";
import {ScrollArea} from "@/components/ui/scroll-area";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface tableData {
  name: string;
  price: number;
  code: string;
  quantity: number;
  category: string;
  description: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [productsSelect, setProductsSelect] = useState<tableData[]>([]);

  function handleQuantity(
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number
  ) {
    const value = e.target.value;
    const rowKey = rowIndex;
    console.log("Value: ", value, "RowKey: ", rowIndex);

    const row = productsSelect[rowKey];
    console.log("Fila seleccionda:", row);

    const quantityAvailable = row.quantity;

    if (value <= quantityAvailable) {
      const updateList = [...productsSelect];

      if (updateList[rowKey]) {
        updateList[rowKey] = {
          ...updateList[rowKey],
          units: value,
        };
      }
      setProductsSelect(updateList);
    } else {
      toast.error(
        `La cantidad ingresada excede el stock disponible (${quantityAvailable})`,
        {
          position: "bottom-left",
          duration: 5000,
        }
      );
    }
  }

  const table = useReactTable({
    data,
    columns,
    initialState: {pagination: {pageSize: 10}},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  function handleTotal() {
    const total = 0;
    productsSelect.forEach((row) => {
      total += row.price * row.units;
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-2 items-start mb-4 mt-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Inventory products
        </h1>
        <p className="text-muted-foreground">
          Select product and click in "Add to cart" to set the products for
          purchase
        </p>
      </div>
      <hr />
      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-row gap-5 items-center">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm rounded-xl dark: bg-transparent"
            />
          </div>
          <div>
            <Button
              variant="outline"
              className="rounded-xl dark: bg-transparent"
              onClick={() => {
                const rows = table.getSelectedRowModel().flatRows;
                const formatRows = rows.map((row, index) => {
                  return {
                    ...row.original,
                    units: 0,
                  };
                });
                console.log("Fila formateada: ", formatRows);
                setProductsSelect((prevListSelected) => [
                  ...prevListSelected,
                  ...formatRows,
                ]);
                setRowSelection({});
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto rounded-xl dark: bg-transparent"
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-xl dark: bg-transparent"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-xl dark: bg-transparent"
        >
          Next
        </Button>
      </div>
      <div className="flex flex-row gap-5 items-center mb-4 mt-4">
        <div className="mt-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cart product list
          </h1>
          <p className="text-muted-foreground">
            When you finish adding product click the button to generate the
            invoice
          </p>
        </div>
        <Button
          variant={"outline"}
          className=" rounded-xl dark: bg-transparentrounded-xl dark: bg-transparent"
          onClick={() => console.log(productsSelect)}
        >
          Complete purchase
        </Button>
        <Button
          variant={"outline"}
          className=" rounded-xl dark: bg-transparentrounded-xl dark: bg-transparent"
        >
          Cancel
        </Button>
      </div>
      <hr />
      <div className="mt-5 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="w-[100px]">Stock</TableHead>
              <TableHead className="w-[100px]">Units</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[200px]">Description</TableHead>
              <TableHead className="w-[150px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableBody>
              {productsSelect.map((row, index) => {
                const formattedPrice = new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(row.price);

                const formattedAmount = new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(row.price * row.units);

                return (
                  <TableRow key={index}>
                    <TableCell className="w-[200px]">{row.name}</TableCell>
                    <TableCell className="w-[100px]">
                      {formattedPrice}
                    </TableCell>
                    <TableCell className="w-[100px]">{row.code}</TableCell>
                    <TableCell className="w-[100px]">{row.quantity}</TableCell>
                    <TableCell className="w-[100px]">
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) => handleQuantity(e, index)}
                        className="rounded-xl dark:bg-transparent w-full"
                      />
                    </TableCell>
                    <TableCell className="w-[150px]">{row.category}</TableCell>
                    <TableCell className="w-[200px]">
                      {row.description}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      {formattedAmount}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center font-bold">
                Total:{" "}
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div>
        <Toaster richColors />
      </div>
    </div>
  );
}
