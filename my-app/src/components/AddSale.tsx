"use client";

import {columns} from "./Columns-sale";
import {DataTable} from "./Data-table-sale";
import React, {useState, useEffect} from "react";
import GetDataProducts from "@/utils/products";
import {Card, CardContent} from "@/components/ui/card";

interface Product {
  id: string;
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
      <Card className="dark:bg-transparent rounded-xl">
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Inventory;
