"use client";

import React, {useState, useEffect} from "react";
import {Button} from "./ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  BarChart,
  PlusCircle,
  ClipboardList,
  Users,
} from "lucide-react";
import Dashboard from "./Dashboard";
import {ModeToggle} from "../components/ModeTogle";
import Inventory from "./Inventory";
import Sales from "./Sales";
import Addsale from "../components/AddSale";
import FormSupplier from "./AddSupplier";
import {motion, AnimatePresence} from "framer-motion";
import ViewSales from "./ViewSales";

export default function Component() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveComponent("WelcomeMessage");
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = (component: string) => {
    setActiveComponent(component);
    setActiveButton(component);
  };

  const handleDashboardClick = (component: string) => {
    setActiveComponent(component);
  };

  const buttonClass = (name: string) =>
    `justify-start items-center ${
      activeButton === name
        ? "bg-zinc-200 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-50"
        : "hover:bg-zinc-200 dark:hover:bg-zinc-600"
    }`;

  const menuItems = [
    {name: "Dashboard", icon: LayoutDashboard},
    {name: "Inventory", icon: Package},
    {name: "View sales", icon: ShoppingCart},
    {name: "Add sale", icon: PlusCircle},
    {name: "Add product", icon: ClipboardList},
    {name: "Suppliers", icon: Truck},
    {name: "Reports", icon: BarChart},
    {name: "Users", icon: Users},
  ];

  return (
    <div className="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] h-screen">
      <section
        id="menu-top-side"
        className="col-span-2 h-14 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-700"
      >
        <nav className="flex flex-row items-center justify-between">
          <Button
            variant={"link"}
            className="p-4 text-xl"
            onClick={() => {
              setActiveComponent("WelcomeMessage");
              setActiveButton(null);
            }}
          >
            Inventory app
          </Button>
          <div className="p-2">
            <ModeToggle />
          </div>
        </nav>
      </section>

      <section
        id="menu-left-side"
        className="row-span-2 dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700"
      >
        <div className="flex flex-col w-56">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              name={item.name}
              className={buttonClass(item.name)}
              onClick={() => handleButtonClick(item.name)}
            >
              <item.icon size={18} className="mr-2" />
              {item.name}
            </Button>
          ))}
        </div>
      </section>

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
            {activeComponent === "Dashboard" && (
              <Dashboard component={handleDashboardClick} />
            )}
            {activeComponent === "Inventory" && <Inventory />}
            {activeComponent === "View sales" && <ViewSales />}
            {activeComponent === "Add sale" && <Addsale />}
            {activeComponent === "Add product" && <Sales />}
            {activeComponent === "Suppliers" && <FormSupplier />}
            {activeComponent === "Reports" && <div>Reports Component</div>}
            {activeComponent === "Users" && <div>Users Component</div>}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
