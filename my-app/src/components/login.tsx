"use client";

import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LockIcon, UserIcon} from "lucide-react";
import GetToken from "@/utils/auth";
import {FormEvent, useState} from "react";
import {toast, Toaster} from "sonner";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({onLoginSuccess}: LoginProps) {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = e.target;
    setData({...data, [name]: value});
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const {username, password} = data;
    const isAuthenticated = await GetToken(username, password);

    if (isAuthenticated) {
      onLoginSuccess();
    } else {
      toast.error("No authorize, validate your data", {
        position: "bottom-left",
        duration: 5000,
      });
    }
  }

  return (
    <div className="area">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 ">
        <Card className="w-full max-w-sm mx-auto bg-transparent border-zinc-600 rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-zinc-100">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-zinc-300">
              Accede a tu cuenta para gestionar el inventario
            </CardDescription>
          </CardHeader>
          <form action="" onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="Username" className="sr-only">
                  Username
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    autoFocus
                    id="Username"
                    placeholder="Username"
                    type="text"
                    className="pl-10 dark:bg-transparent !rounded-[8px]"
                    required
                    name="username"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="password"
                    placeholder="password"
                    type="password"
                    className="pl-10 dark:bg-transparent !rounded-[8px]"
                    required
                    name="password"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant={"outline"}
                className="w-full bg-transparent rounded-xl z-10"
                // onClick={handleSubmit}
                // autoFocus
                // onKeyDown={(e) => {
                //   console.log("enter ejecutado");
                //   if (e.key === "Enter") {
                //     handleSubmit();
                //   }
                // }}
              >
                Iniciar Sesión
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div>
          <Toaster richColors />
        </div>
      </div>
    </div>
  );
}
