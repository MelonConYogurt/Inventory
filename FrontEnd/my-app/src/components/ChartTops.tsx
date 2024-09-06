"use client";

import {Bar, BarChart, XAxis, YAxis, LabelList, CartesianGrid} from "recharts";
import {useEffect, useState} from "react";
import GetStadiscticData from "@/utils/statistic";
import {TrendingUp, TrendingDown} from "lucide-react";
import {toast, Toaster} from "sonner";

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
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

interface product {
  product_name: string;
  total_quantity: number;
}

export function ChartTops() {
  const [chartDataLeast, setChartDataLeast] = useState<product[]>([]);
  const [chartDataMost, setChartDataMost] = useState<product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function GetData() {
      try {
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
      } catch (error) {
        toast.error("Error loading data");
      } finally {
        setIsLoading(false);
      }
    }
    GetData();
  }, []);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Wait while loading the database", {
        position: "bottom-left",
      });
    } else {
      toast.dismiss();
    }
  }, [isLoading]);

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
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="product"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="quantity" fill="var(--color-quantity)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
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
              margin={{
                right: 30,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="quantity" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="quantity"
                layout="vertical"
                fill="var(--color-quantity)"
                radius={4}
              >
                <LabelList
                  dataKey="product"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="quantity"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Displaying stock levels for the 10 products with the most inventory
          </div>
        </CardFooter>
      </Card>
      <>
        <Toaster richColors />
      </>
    </div>
  );
}
