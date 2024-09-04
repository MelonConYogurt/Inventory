"use client";

import {columns as salesColumns} from "./Columns-sales";
import {columns as productsColumns} from "./Columns-products-sale";
import {DataTable} from "./Data-table-sales";
import {DataTableProducts} from "./Data-table-products-sale";
import GetSalesData from "@/utils/Sales-data";
import GetProductsSale from "@/utils/Products-sale";
import {useEffect, useState} from "react";

interface sales {
  sale_id: string;
  sale_code: number;
  sale_date: string;
  sale_total: number;
}

interface salesProducts {
  sale_products_id: number;
  sale_id: string;
  product_id: number;
  quantity: number;
  product_price_at_sale: number;
}

function ViewSales() {
  const [data, setData] = useState<sales[]>([]);
  const [dataProducts, setDataProducts] = useState<salesProducts[]>([]);

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
    <>
      <DataTable columns={salesColumns} data={data}></DataTable>
      <DataTableProducts
        columns={productsColumns}
        data={dataProducts}
      ></DataTableProducts>
      <></>
    </>
  );
}

export default ViewSales;
