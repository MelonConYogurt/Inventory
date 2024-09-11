"use client";

import * as React from "react";
import {useState, useEffect} from "react";
import {Label, Pie, PieChart} from "recharts";
import GetStadiscticData from "@/utils/statistic";
import {BarChart3, Car, Package, DollarSign} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartsCommons() {
  interface ChartData {
    product_category: string;
    amount: number;
    fill: string;
  }

  const [data, setData] = useState<ChartData[]>([]);
  const [chartConfig, setChartConfig] = useState({});
  const [value, setValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseData = await GetStadiscticData();

        const chartData = await responseData.category_counts;
        const total_value_inventory = responseData.value_inventory;

        const newData = chartData.map(
          (element: {product_category: string; amount: any}) => {
            const category = element.product_category
              .replace(/\s+/g, "-")
              .toLowerCase();
            return {
              category: element.product_category,
              amount: element.amount,
              fill: `var(--color-${category})`,
            };
          }
        );

        const newChartConfig = chartData.reduce(
          (
            config: {[x: string]: {label: any; color: string}},
            element: {product_category: string},
            index: number
          ) => {
            const categoryKey = element.product_category
              .replace(/\s+/g, "-")
              .toLowerCase();
            config[categoryKey] = {
              label: element.product_category,
              color: `hsl(var(--chart-${index + 1}))`,
            };
            return config;
          },
          {}
        );

        setData(newData);
        setValue(total_value_inventory);
        setChartConfig(newChartConfig);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const totalAmount = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.amount, 0);
  }, [data]);

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <Card className="rounded-xl dark:bg-transparent w-1/2">
        <CardHeader className="items-center pb-0">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Categories
          </CardTitle>
          <CardDescription>Amount of product for each category</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({viewBox}) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalAmount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Products
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none"></div>
          <div className="leading-none text-muted-foreground">
            Showing total of the data with category established
          </div>
        </CardFooter>
      </Card>
      <Card className="rounded-xl dark:bg-transparent w-1/2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Total Products
          </CardTitle>
          <CardDescription>
            Total number of products in database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px]">
            <span className="text-6xl font-bold">
              {totalAmount.toLocaleString()}
            </span>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          This represents the total count of all products across all categories
        </CardFooter>
      </Card>
      <Card className="rounded-xl dark:bg-transparent w-1/2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign />
            Value of the inventory
          </CardTitle>
          <CardDescription>Total value calculate</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="text-4xl font-bold">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(value)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
