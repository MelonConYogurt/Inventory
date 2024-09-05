"use client";

import {columns as salesColumns} from "./Columns-sales";
import {columns as productsColumns} from "./Columns-products-sale";
import {DataTable} from "./Data-table-sales";
import {DataTableProducts} from "./Data-table-products-sale";
import GetSalesData from "@/utils/Sales-data";
import GetProductsSale from "@/utils/Products-sale";
import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";
import {BarChart3Icon, ShoppingCartIcon} from "lucide-react";

interface Sales {
  sale_id: string;
  sale_code: number;
  sale_date: string;
  sale_total: number;
}

interface SalesProducts {
  sale_products_id: number;
  sale_id: string;
  product_id: number;
  quantity: number;
  product_price_at_sale: number;
}

export default function ViewSales() {
  const [data, setData] = useState<Sales[]>([]);
  const [dataProducts, setDataProducts] = useState<SalesProducts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetSalesData();
      const resultProducts = await GetProductsSale();
      setDataProducts(resultProducts);
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Card className="dark:bg-transparent rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3Icon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Sales Overview
          </h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Explore our comprehensive sales database. Filter transactions by ID
          and analyze product sales data for valuable insights.
        </p>
        <DataTable columns={salesColumns} data={data} />
      </Card>
      <Card className="dark:bg-transparent rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCartIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Product Sales Details
          </h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Dive deep into individual sale transactions. Filter products by sale
          ID to track specific order contents and performance.
        </p>
        <DataTableProducts columns={productsColumns} data={dataProducts} />
      </Card>
    </div>
  );
}
