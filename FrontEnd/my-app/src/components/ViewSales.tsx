"use client";

import {columns} from "./Columns-sales";
import {DataTable} from "./Data-table-sales";
import GetSalesData from "@/utils/Sales-data";
import {useEffect, useState} from "react";

interface sales {
  sale_id: string;
  sale_code: string;
  sale_date: string;
  sale_total: string;
}

function ViewSales() {
  const [data, setData] = useState<sales[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetSalesData();
      console.log(result);
      setData(result);
    };
    fetchData();
  }, []);

  return (
    <>
      <DataTable columns={columns} data={data}></DataTable>
    </>
  );
}

export default ViewSales;
