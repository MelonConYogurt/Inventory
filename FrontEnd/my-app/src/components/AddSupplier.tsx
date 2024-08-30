"use client";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {DataTable} from "./Data-table-supplier";
import {columns} from "./Columns-suppliers";
import {useState, FormEvent, useEffect} from "react";
import SendSupplierData from "@/utils/SendSupplier";
import GetSuppliersData from "@/utils/Suppliers-data";
import {UserPlus, Search} from "lucide-react";

interface Supplier {
  name: string;
  phone: string;
  direction: string;
  nit: string;
  email: string;
  contact: string;
}

export default function FormSupplier() {
  const inputClasses = "dark:bg-transparent !rounded-[8px]";
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState<Supplier>({
    name: "",
    phone: "",
    direction: "",
    nit: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
    async function fetchSuppliers() {
      const suppliersData = await GetSuppliersData();
      setTableData(suppliersData);
    }
    fetchSuppliers();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dataToSend = {
      ...data,
      phone: Number(data.phone),
      nit: Number(data.nit),
    };
    const validation = SendSupplierData(dataToSend);
    if (validation) {
      setData({
        name: "",
        phone: "",
        direction: "",
        nit: "",
        email: "",
        contact: "",
      });
    }
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-10">
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Register a new supplier
            </h1>
            <p className="text-muted-foreground">
              Fill in the form below to add a new supplier to the system.
            </p>
          </div>
          <hr />
          <Card className="border-2 shadow-lg dark:bg-transparent rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="w-6 h-6" />
                <span>Supplier Information</span>
              </CardTitle>
              <CardDescription>
                Please provide the supplier's contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      className={inputClasses}
                      id="name"
                      name="name"
                      placeholder="Enter company name"
                      value={data.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      className={inputClasses}
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={data.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="direction">Address</Label>
                    <Input
                      className={inputClasses}
                      id="direction"
                      name="direction"
                      placeholder="Enter company address"
                      value={data.direction}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nit">NIT (Tax ID)</Label>
                    <Input
                      className={inputClasses}
                      id="nit"
                      name="nit"
                      placeholder="Enter NIT"
                      value={data.nit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      className={inputClasses}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={data.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <Input
                      className={inputClasses}
                      id="contact"
                      name="contact"
                      placeholder="Enter contact person's name"
                      value={data.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <CardFooter className="px-0 pt-6">
                  <Button
                    variant={"outline"}
                    type="submit"
                    className="w-full dark:bg-transparent rounded-xl font-bold"
                  >
                    Register Supplier
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Existing Suppliers
            </h2>
            <p className="text-muted-foreground">
              Search and manage your current supplier database.
            </p>
          </div>
          <hr />
          <Card className="dark:bg-transparent rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-6 h-6" />
                <span>Supplier Database</span>
              </CardTitle>
              <CardDescription>
                View and search for existing suppliers in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={tableData} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
