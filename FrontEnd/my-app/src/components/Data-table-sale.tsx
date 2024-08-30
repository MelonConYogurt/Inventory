"use client";
import * as React from "react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast, Toaster} from "sonner";

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

    const row = data[rowKey];
    const quantityAvailable = row.quantity;

    if (value <= quantityAvailable) {
      const updateList = [...productsSelect];

      if (updateList[rowKey]) {
        updateList[rowKey] = {
          ...updateList[rowKey],
          quantity: value,
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

  const totalAmount = productsSelect.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  return (
    <div>
      <div className="flex flex-col gap-2 items-start mb-4 mt-4">
        <h1 className="text-3xl">Inventory products</h1>
        <p className="text-base font-light">
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
                const formatRows = rows.map((row) => {
                  return {
                    ...row.original,
                    quantity: 0,
                  };
                });

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
        <h1 className="text-3xl font">Cart product list</h1>
        <Button
          variant={"outline"}
          className="rounded-xl dark: bg-transparentrounded-xl dark: bg-transparent"
          onClick={() => console.log(productsSelect)}
        >
          Complete purchase
        </Button>
      </div>
      <hr />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsSelect.map((row, index) => {
              const formattedPrice = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(row.price);

              const formattedAmount = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(row.price * row.quantity);

              return (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{formattedPrice}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      onChange={(e) => handleQuantity(e, index)}
                      className="rounded-xl dark: bg-transparent w-auto"
                    ></Input>
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{formattedAmount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell>
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(totalAmount)}
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
