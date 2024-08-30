"use client";

import {columns} from "../components/Columns";
import {DataTable} from "./Data-table";
import React, {useState, useEffect} from "react";
import {ChartCategory} from "../components/ChartCategory";
import GetDataProducts from "@/utils/products";
import {Package} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Product {
  name: string;
  price: number;
  code: string;
  quantity: number;
  category: string;
  description: string;
}

function Inventory() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Failed to retrieve authentication token");
        setLoading(false);
        return;
      }

      const products = await GetDataProducts(1000);
      if (products.length === 0) {
        setError("No products found or failed to fetch products");
      }

      setData(products);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="mb-5">
        <Card className="dark:bg-transparent rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-6 h-6" />
              <span>Supplier Database</span>
            </CardTitle>
            <CardDescription>
              View and search for existing suppliers in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} />
          </CardContent>
        </Card>
      </div>
      <div className="w-auto h-auto">
        <ChartCategory />
      </div>
    </div>
  );
}

export default Inventory;
