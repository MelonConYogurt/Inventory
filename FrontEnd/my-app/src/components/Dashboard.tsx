import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartsCommons} from "./ChartCategory";
import {ChartTops} from "./ChartTops";
import {Button} from "./ui/button";
import {
  Plus,
  FileText,
  Truck,
  ShoppingBasket,
  PackageSearch,
} from "lucide-react";

function Dashboard() {
  const classCards = "dark:bg-transparent rounded-xl hover:-translate-y-1 ";
  return (
    <div>
      <div className="flex flex-row gap-5 mb-5 ">
        <Card className={classCards}>
          <CardHeader className="flex flex-row items-center gap-2">
            <Plus />
            <CardTitle>Add New Items</CardTitle>
          </CardHeader>
          <CardContent> Add a new items to your inventory.</CardContent>
        </Card>
        <Card className={classCards}>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText />
            <CardTitle>View Reports</CardTitle>
          </CardHeader>
          <CardContent>Acces your inventory reports.</CardContent>
        </Card>
        <Card className={classCards}>
          <CardHeader className="flex flex-row items-center gap-2">
            <Truck />
            <CardTitle>Manage Suppliers</CardTitle>
          </CardHeader>
          <CardContent>View and manage your suppliers information.</CardContent>
        </Card>
        <Card className={classCards}>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShoppingBasket />
            <CardTitle>Add New Sale</CardTitle>
          </CardHeader>
          <CardContent>
            Ready to sale some of the item in the inventory.
          </CardContent>
        </Card>
        <Card className={classCards}>
          <CardHeader className="flex flex-row items-center gap-2">
            <PackageSearch />
            <CardTitle>Searh Items in the inventory</CardTitle>
          </CardHeader>
          <CardContent>
            View and filter your actual items in the database.
          </CardContent>
        </Card>
      </div>
      <ChartsCommons></ChartsCommons>
      <ChartTops></ChartTops>
    </div>
  );
}

export default Dashboard;
