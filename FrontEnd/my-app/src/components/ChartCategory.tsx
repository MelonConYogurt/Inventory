"use client";

import * as React from "react";
import {useState, useEffect} from "react";
import {Label, Pie, PieChart} from "recharts";
import GetToken from "@/utils/auth";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartCategory() {
  const [data, setData] = useState([]);
  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await GetToken();
        const responseData = await GetStadiscticData(token);

        const chartData = await responseData.category_counts;

        const newData = chartData.map((element) => {
          const category = element.product_category
            .replace(/\s+/g, "-")
            .toLowerCase();
          return {
            category: element.product_category,
            amount: element.amount,
            fill: `var(--color-${category})`,
          };
        });

        const newChartConfig = chartData.reduce((config, element, index) => {
          const categoryKey = element.product_category
            .replace(/\s+/g, "-")
            .toLowerCase();
          config[categoryKey] = {
            label: element.product_category,
            color: `hsl(var(--chart-${index + 1}))`,
          };
          return config;
        }, {});

        setData(newData);
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
    <Card className="flex flex-col rounded-xl dark:bg-transparent ">
      <CardHeader className="items-center pb-0">
        <CardTitle>Categories</CardTitle>
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
  );
}
