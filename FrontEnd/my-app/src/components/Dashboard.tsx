import {
  Plus,
  FileText,
  Truck,
  ShoppingBasket,
  PackageSearch,
} from "lucide-react";
import {ChartsCommons} from "./ChartCategory";
import {ChartTops} from "./ChartTops";

export default function Dashboard() {
  const handleClick = (component: string) => {
    console.log(`Clicked: ${component}`);
  };

  const cardClass = `
    dark:bg-transparent border p-4 rounded-xl transition-all duration-300 ease-in-out
    hover:-translate-y-1 hover:shadow-lg cursor-pointer
    bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground
  `;

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mt-5 flex items-center gap-2">
          Quik actions
        </h1>
        <p className="text-muted-foreground mb-5 flex items-center gap-2">
          Select one option to start
        </p>
        <hr className="mb-5 mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-5">
        <div
          onClick={() => handleClick("Add product")}
          className={cardClass}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Add New Items</h3>
          </div>
          <p>Add a new items to your inventory.</p>
        </div>

        <div
          onClick={() => handleClick("Reports")}
          className={cardClass}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6" />
            <h3 className="text-lg font-semibold">View Reports</h3>
          </div>
          <p>Access your inventory reports.</p>
        </div>

        <div
          onClick={() => handleClick("Suppliers")}
          className={cardClass}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Manage Suppliers</h3>
          </div>
          <p>View and manage your suppliers information.</p>
        </div>

        <div
          onClick={() => handleClick("Add sale")}
          className={cardClass}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBasket className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Add New Sale</h3>
          </div>
          <p>Ready to sale some of the item in the inventory.</p>
        </div>

        <div
          onClick={() => handleClick("Inventory")}
          className={cardClass}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <PackageSearch className="h-6 w-6" />
            <h3 className="text-lg font-semibold">
              Search Items in the inventory
            </h3>
          </div>
          <p>View and filter your actual items in the database.</p>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold tracking-tight mt-5 flex items-center gap-2">
          Visualisate the data
        </h1>
        <p className="text-muted-foreground mb-5 flex items-center gap-2">
          Hover over the columns to se the data
        </p>
        <hr className="mb-5 mt-2" />
      </div>
      <ChartsCommons />
      <ChartTops />
    </div>
  );
}
