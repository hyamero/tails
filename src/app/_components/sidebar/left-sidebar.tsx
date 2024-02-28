"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { useSession } from "next-auth/react";
import { useBoundStore } from "~/lib/use-bound-store";
import { Card } from "../ui/card";
import { BudgetStats } from "../payment/budget-stats";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function LeftSideBar() {
  const { data: session } = useSession();
  const sessionUser = useBoundStore((state) => state.user);

  if (!session || !sessionUser) return null;

  return (
    <aside className="mx-auto w-full max-w-xl space-y-2">
      <Card className="flex items-center justify-between space-x-4 p-5">
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-semibold text-foreground">
              {session?.user.name}
            </h4>
            {sessionUser.username && (
              <h4 className="text-sm font-normal text-muted-foreground">
                {"@" + sessionUser.username}
              </h4>
            )}
          </div>
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
            <span className="text-xs text-muted-foreground">
              Joined {format(new Date(sessionUser.createdAt), "MMMM yyyy")}
            </span>
          </div>
        </div>

        <Link href={`/user/${sessionUser.username}`} className="font-semibold">
          <Avatar className="h-16 w-16">
            <AvatarImage
              className="rounded-full"
              src={session?.user.image as string | undefined}
              alt={`${session?.user.name}'s avatar`}
            />
            <AvatarFallback className="text-xs">
              {session?.user.name?.split(" ").at(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </Card>

      <Accordion
        type="single"
        defaultValue="stats"
        collapsible
        className="w-full"
      >
        <AccordionItem value="stats">
          <AccordionTrigger className="px-4 font-semibold text-foreground">
            {" "}
            Statistics
          </AccordionTrigger>
          <AccordionContent>
            <BudgetStats />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
