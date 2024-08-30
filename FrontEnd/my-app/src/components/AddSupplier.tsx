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
import {useState, FormEvent} from "react";
import SendSupplierData from "@/utils/SendSupplier";

interface Supplier {
  name: string;
  phone: string;
  direction: string;
  nit: string;
  email: string;
  contact: string;
}

export default function FormSupplier() {
  const [data, setData] = useState<Supplier>({
    name: "",
    phone: "",
    direction: "",
    nit: "",
    email: "",
    contact: "",
  });

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
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl">Register a new supplier</h1>
        <p className="text-base font-light">
          You can search if the supplier already exists in the data table
        </p>
      </div>
      <hr />
      <div className="self-start w-full max-w-2xl mx-auto">
        <Card className="dark:bg-transparent rounded-xl">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Please fill in your contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className="dark:bg-transparent !rounded-[8px]"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="dark:bg-transparent !rounded-[8px]"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Input
                    id="direction"
                    name="direction"
                    placeholder="Enter your address"
                    className="dark:bg-transparent !rounded-[8px]"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nit">NIT</Label>
                  <Input
                    id="nit"
                    name="nit"
                    placeholder="Enter your NIT"
                    className="dark:bg-transparent !rounded-[8px]"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="dark:bg-transparent !rounded-[8px]"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="contact">Contact Name</Label>
                  <Input
                    id="contact"
                    name="contact"
                    placeholder="Enter contact person's name"
                    className="dark:bg-transparent !rounded-[8px]"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <CardFooter className="px-0 pt-6">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full dark:bg-transparent !rounded-[8px] font-bold"
                >
                  Submit
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
      <div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
}
