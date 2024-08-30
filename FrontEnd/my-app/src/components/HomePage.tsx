"use client";

import React, {useState, useEffect} from "react";
import {Button} from "./ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BarChart,
  CirclePlus,
  ShoppingBasket,
} from "lucide-react";
import CardDisplay from "./Dashboard";
import {ModeToggle} from "../components/ModeTogle";
import Inventory from "./Inventory";
import Sales from "./Sales";
import Addsale from "../components/AddSale";
import FormSupplier from "./AddSupplier";
import {motion, AnimatePresence} from "framer-motion";

function HomePage() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveComponent("WelcomeMessage");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <div className="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] h-screen">
      {/* Menu top */}
      <section
        id="menu-top-side"
        className="col-span-2 h-14 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700"
      >
        <nav className="flex flex-row items-center justify-between">
          <Button
            variant={"link"}
            className="p-4 text-xl"
            onClick={() => setActiveComponent("WelcomeMessage")}
          >
            Inventory app
          </Button>
          <div className="p-2">
            <ModeToggle />
          </div>
        </nav>
      </section>

      {/* Menu side */}
      <section
        id="menu-left-side"
        className="row-span-2 w-60 dark:bg-zinc-800 p-2 border-r border-zinc-300 dark:border-zinc-700"
      >
        <div className="flex flex-col w-56">
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("Dashboard")}
          >
            <LayoutDashboard size={18} className="mr-2" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("Inventory")}
          >
            <Package size={18} className="mr-2" />
            Inventory
          </Button>
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("View sales")}
          >
            <ShoppingCart size={18} className="mr-2" />
            View sales
          </Button>
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("Add sale")}
          >
            <ShoppingBasket size={18} className="mr-2" />
            Add sale
          </Button>
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("Add product")}
          >
            <CirclePlus size={18} className="mr-2" />
            Add product
          </Button>
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("Suppliers")}
          >
            <Truck size={18} className="mr-2" />
            Suppliers
          </Button>
          <Button
            variant="ghost"
            className="justify-start dark:hover:bg-zinc-600 rounded-xl"
            onClick={() => handleButtonClick("Reports")}
          >
            <BarChart size={18} className="mr-2" />
            Reports
          </Button>
        </div>
      </section>
      {/* Main display */}
      <section
        id="main-display"
        className="dark:bg-zinc-900 p-4 border-l border-t border-zinc-300 dark:border-zinc-700"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}
          >
            {activeComponent === "WelcomeMessage" && (
              <div className="text-center mt-20">
                <motion.h2
                  className="text-4xl font-bold mb-4"
                  initial={{scale: 0.5, opacity: 0}}
                  animate={{scale: 1, opacity: 1}}
                  transition={{delay: 0.2, duration: 0.5}}
                >
                  Welcome to the Inventory App
                </motion.h2>
                <motion.p
                  className="text-zinc-500 dark:text-zinc-400 text-lg"
                  initial={{y: 20, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{delay: 0.4, duration: 0.5}}
                >
                  Select a menu item to get started or use the search bar above.
                </motion.p>
              </div>
            )}
            {activeComponent === "Dashboard" && <CardDisplay />}
            {activeComponent === "Inventory" && <Inventory />}
            {activeComponent == "View sales"}
            {activeComponent == "Add sale" && <Addsale />}
            {activeComponent === "Add product" && <Sales />}
            {activeComponent === "Suppliers" && <FormSupplier />}
            {activeComponent === "Reports" && <div>Reports Component</div>}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

export default HomePage;
