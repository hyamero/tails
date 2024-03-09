import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { useBoundStore } from "~/lib/utils/use-bound-store";
import { Button } from "~/app/_components/ui/button";
import { CreditCard } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/app/_components/ui/drawer";

const data = [
  {
    amount: 400,
  },
  {
    amount: 300,
  },
  {
    amount: 200,
  },
  {
    amount: 300,
  },
  {
    amount: 200,
  },
  {
    amount: 278,
  },
  {
    amount: 189,
  },
  {
    amount: 239,
  },
  {
    amount: 300,
  },
  {
    amount: 200,
  },
  {
    amount: 278,
  },
  {
    amount: 189,
  },
  {
    amount: 349,
  },
];

export function DonationDrawer({ orgId }: { orgId: string }) {
  const setDonation = useBoundStore((state) => state.setDonation);

  const [amount, setAmount] = React.useState(350);

  function onClick(adjustment: number) {
    setAmount(Math.max(200, Math.min(10000, amount + adjustment)));
  }

  const router = useRouter();

  const handleDonation = () => {
    setDonation(amount);
    router.push(`/donate/${orgId}`);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex items-center font-semibold">
          <CreditCard className="mt-[2px] h-4" />
          <div>Donate</div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>For the Animals!</DrawerTitle>
            <DrawerDescription>Set your donation amount.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex max-w-sm items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-50)}
                disabled={amount <= 200}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full text-center text-7xl font-bold tracking-tighter [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Pesos
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(50)}
                disabled={amount >= 10000}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="amount"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => handleDonation()} className="w-full">
              Donate
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
