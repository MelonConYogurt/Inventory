import {
  Plus,
  FileText,
  Truck,
  ShoppingBasket,
  PackageSearch,
} from "lucide-react";
import {ChartsCommons} from "./ChartCategory";
import {ChartTops} from "./ChartTops";

interface DashboardProps {
  component: (componentActive: string) => void;
}

export default function Dashboard({component}: DashboardProps) {
  const handleClick = (componentActive: string) => {
    component(componentActive);
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
          Quick Actions
        </h1>
        <p className="text-muted-foreground mb-5 flex items-center gap-2">
          Select an option to get started.
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
            <h3 className="text-lg font-semibold">Add New Product</h3>
          </div>
          <p>Add a new product to your inventory.</p>
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
          <p>Access detailed inventory reports.</p>
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
          <p>View and manage supplier information.</p>
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
          <p>Record a sale for items in your inventory.</p>
        </div>

        <div
          onClick={() => handleClick("Inventory")}
          className={cardClass}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <PackageSearch className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Search Inventory</h3>
          </div>
          <p>View and filter items in your inventory.</p>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold tracking-tight mt-5 flex items-center gap-2">
          Visualize Data
        </h1>
        <p className="text-muted-foreground mb-5 flex items-center gap-2">
          Hover over the charts to view detailed data.
        </p>
        <hr className="mb-5 mt-2" />
      </div>
      <ChartsCommons />
      <ChartTops />
    </div>
  );
}
