"use client";

import {Bar, BarChart, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import GetStadiscticData from "@/utils/statistic";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A mixed bar chart";

const chartConfig = {
  quantity: {
    label: "Quantity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface product {
  product_name: string;
  total_quantity: number;
}

export function ChartTopLeast() {
  const [chartData, setChartData] = useState<product[]>([]);

  useEffect(() => {
    async function GetData() {
      const data = await GetStadiscticData();
      const top = data.top_10_least_quantity;
      console.log(top);
      const newData = top.map((product: product) => {
        return {
          product: product.product_name,
          quantity: product.total_quantity,
        };
      });
      console.log(newData);
      setChartData(newData);
    }
    GetData();
  }, []);

  return (
    <>
      <Card className="flex flex-col items-center justify-center rounded-xl dark:bg-transparent mt-5 ">
        <CardHeader>
          <CardTitle>Top 10 Products with Lowest Stock</CardTitle>
          <CardDescription>
            Hover over the bars to view detailed stock quantities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{left: 20}}
            >
              <XAxis type="number" dataKey="quantity" hide />
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="quantity" fill="var(--color-quantity)" radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Displaying stock levels for the 10 products with the least inventory
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>Total of products</CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
}
