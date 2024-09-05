"use client";

import {Bar, BarChart, XAxis, YAxis} from "recharts";
import {useEffect, useState} from "react";
import GetStadiscticData from "@/utils/statistic";
import {TrendingUp, TrendingDown} from "lucide-react";

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
  const [chartDataLeast, setChartDataLeast] = useState<product[]>([]);
  const [chartDataMost, setChartDataMost] = useState<product[]>([]);

  useEffect(() => {
    async function GetData() {
      const data = await GetStadiscticData();
      const top_least = data.top_10_least_quantity;
      const top_most = data.top_10_most_quantity;
      const newDataLeast = top_least.map((product: product) => {
        return {
          product: product.product_name,
          quantity: product.total_quantity,
        };
      });
      const newDataMost = top_most.map((product: product) => {
        return {
          product: product.product_name,
          quantity: product.total_quantity,
        };
      });
      setChartDataLeast(newDataLeast);
      setChartDataMost(newDataMost);
    }
    GetData();
  }, []);

  return (
    <div className="flex flex-row gap-5">
      <Card className="flex flex-col items-center justify-center rounded-xl dark:bg-transparent mt-5  w-1/2">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <TrendingDown /> Top 10 Products with Lowest Stock
          </CardTitle>
          <CardDescription>
            Hover over the bars to view detailed stock quantities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <BarChart
              accessibilityLayer
              data={chartDataLeast}
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
      <Card className="flex flex-col items-center justify-center rounded-xl dark:bg-transparent mt-5 w-1/2">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <TrendingUp />
            Top 10 Products with Most Stock
          </CardTitle>
          <CardDescription>
            Hover over the bars to view detailed stock quantities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <BarChart
              accessibilityLayer
              data={chartDataMost}
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
            Displaying stock levels for the 10 products with the most inventory
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
