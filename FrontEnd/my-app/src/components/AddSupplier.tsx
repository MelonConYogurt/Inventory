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

export default function FormSupplier() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl">Register a new supplier</h1>
        <p className="text-base font-light">
          You can search if the supplier already exist in the data table
        </p>
      </div>
      <hr />
      <div className="self-start">
        <Card className="w-full max-w-2xl mx-auto  dark:bg-transparent rounded-xl">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Please fill in your contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="dark:bg-transparent !rounded-[8px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="dark:bg-transparent !rounded-[8px]"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Input
                    id="direction"
                    placeholder="Enter your address"
                    className="dark:bg-transparent !rounded-[8px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nit">NIT</Label>
                  <Input
                    id="nit"
                    placeholder="Enter your NIT"
                    className="dark:bg-transparent !rounded-[8px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="dark:bg-transparent !rounded-[8px]"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Enter contact person's name"
                    className="dark:bg-transparent !rounded-[8px]"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              variant={"outline"}
              className="w-full dark:bg-transparent !rounded-[8px] font-bold  "
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div></div>
    </div>
  );
}
