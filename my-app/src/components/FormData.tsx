"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Package,
  PlusCircle,
  RefreshCcw,
  Clipboard,
  ShoppingCart,
  Search,
} from "lucide-react";
import {useState, useEffect} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {toast, Toaster} from "sonner";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import SendData from "@/utils/SendProducts";
import GetDataProducts from "@/utils/products";
import {DataTable} from "./Data-table";
import {columns} from "./Columns";

const inputClasses = "dark:bg-transparent !rounded-[8px]";

interface Product {
  name: string;
  price: string;
  code: string;
  quantity: string;
  category: string;
  description: string;
}

export default function Component() {
  const [formValues, setFormValues] = useState<Product>({
    name: "",
    price: "",
    code: "",
    quantity: "",
    category: "",
    description: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [data, setData] = useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [CategoryValue, setCategoryValue] = React.useState("");
  const [refresh, setRefresh] = useState<number>(0);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const updatedFormValues = {...formValues, category: CategoryValue};
    setFormValues(updatedFormValues);
    setProducts((prevProducts) => [...prevProducts, updatedFormValues]);

    setCategoryValue("");
    setFormValues({
      name: "",
      price: "",
      code: "",
      quantity: "",
      category: "",
      description: "",
    });
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setCategoryValue("");
    setFormValues({
      name: "",
      price: "",
      code: "",
      quantity: "",
      category: "",
      description: "",
    });
    setProducts([]);
    toast.info("The data has been successfully reset.", {
      position: "bottom-left",
      duration: 5000,
    });
  }

  async function handleCreatedProducts() {
    const updatedProducts = products.map((product) => ({
      name: product.name,
      price: parseFloat(product.price),
      code: parseInt(product.code, 10),
      quantity: parseInt(product.quantity, 10),
      category: product.category,
      description: product.description,
    }));

    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const validation = await SendData(updatedProducts);
        if (validation === true) {
          toast.success("Products added to database", {
            position: "bottom-left",
            duration: 5000,
          });
          setProducts([]);
        } else {
          toast.error("Failed to add products to the database", {
            position: "bottom-left",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    } else {
      console.error("Token is null");
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const productsInventory = await GetDataProducts(1000);
        if (productsInventory.length === 0) {
          toast.error("Failed to fetch inventory", {
            position: "bottom-left",
            duration: 5000,
          });
          setData([]);
        } else {
          setData(productsInventory);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [refresh]);

  const categoryValues = [
    {value: "electronics", label: "Electronics"},
    {value: "toys", label: "Toys"},
    {value: "clothing", label: "Clothing"},
    {value: "home decor", label: "Home decor"},
    {value: "Material", label: "Material"},
    {value: "Food", label: "Food"},
    {value: " ", label: "Sports equipment"},
  ];

  return (
    <div className="flex flex-col">
      <div>
        <Toaster richColors />
      </div>

      <div className="flex flex-row gap-5">
        <div className="w-1/3">
          <Card className="dark:bg-transparent rounded-xl ">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create New Product
                </CardTitle>
                <CardDescription>
                  Fill out the form to add a new product to your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Name</Label>
                    <Input
                      id="product-name"
                      name="name"
                      placeholder="Product name"
                      required
                      value={formValues.name}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input
                      id="product-price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      required
                      value={formValues.price}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-code">Code</Label>
                    <Input
                      id="product-code"
                      name="code"
                      type="number"
                      placeholder="Enter barcode"
                      required
                      value={formValues.code}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-quantity">Quantity</Label>
                    <Input
                      id="product-quantity"
                      name="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      required
                      value={formValues.quantity}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-auto justify-between ml-3 !rounded-[8px] dark:bg-transparent"
                      >
                        {CategoryValue
                          ? categoryValues.find(
                              (category) => category.value === CategoryValue
                            )?.label
                          : "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 !rounded-[8px] ">
                      <Command className="!rounded-[8px] dark:bg-zinc-800">
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>Category not found</CommandEmpty>
                          <CommandGroup>
                            {categoryValues.map((category) => (
                              <CommandItem
                                className="dark:hover:bg-zinc-700 !rounded-[8px]"
                                key={category.value}
                                value={category.value}
                                onSelect={(currentValue) => {
                                  setCategoryValue(
                                    currentValue === CategoryValue
                                      ? ""
                                      : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    CategoryValue === category.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    name="description"
                    placeholder="Enter product description"
                    rows={8}
                    value={formValues.description}
                    onChange={handleChange}
                    className={inputClasses}
                  />
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                <Button
                  type="submit"
                  className="rounded-xl w-full dark:bg-transparent font-bold mt-1 mb-1 dark:hover:bg-zinc-800"
                  variant="outline"
                >
                  Add product
                </Button>
                <Button
                  className="rounded-xl w-full dark:bg-transparent font-bold mt-1 mb-1 dark:hover:bg-zinc-800"
                  variant="outline"
                  onClick={handleReset}
                >
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="w-2/3">
          <Card className="dark:bg-transparent rounded-xl ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5" />
                Product List
              </CardTitle>
              <CardDescription>
                Review and confirm the products before adding to inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead className="w-[150px]">Price</TableHead>
                    <TableHead className="w-[150px]">Code</TableHead>
                    <TableHead className="w-[150px]">Quantity</TableHead>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead className="w-[150px]">Description</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[150px]">
                          {product.name}
                        </TableCell>
                        <TableCell className="w-[150px]">
                          {product.price}
                        </TableCell>
                        <TableCell className="w-[150px]">
                          {product.code}
                        </TableCell>
                        <TableCell className="w-[150px]">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="w-[150px]">
                          {product.category}
                        </TableCell>
                        <TableCell className="w-[150px]">
                          {product.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                className="rounded-xl w-full dark:bg-transparent font-bold mt-1 mb-1 dark:hover:bg-zinc-800"
                variant="outline"
                onClick={handleCreatedProducts}
              >
                Create products
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-7">
        <Card className="dark:bg-transparent rounded-xl p-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mt-5 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Current Inventory
            </h2>
            <p className="text-muted-foreground mb-5 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search and manage your existing product inventory
            </p>
            <Button
              variant="outline"
              className="mb-5 rounded-full dark:bg-transparent"
              onClick={() => {
                setRefresh((prev) => prev + 1);
                toast.success("Data reloaded", {
                  position: "bottom-left",
                  duration: 5000,
                });
              }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
          <DataTable columns={columns} data={data} />
        </Card>
      </div>
    </div>
  );
}
