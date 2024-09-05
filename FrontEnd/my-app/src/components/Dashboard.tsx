import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ChartsCommons} from "./ChartCategory";
import {ChartTops} from "./ChartTops";

function CardDisplay() {
  return (
    <div>
      <ChartsCommons></ChartsCommons>
      <ChartTops></ChartTops>
    </div>
  );
}

export default CardDisplay;
