"use client";

import { useSession } from "next-auth/react";
import { useBoundStore } from "~/lib/utils/use-bound-store";
import { OrgsCard } from "./orgs-card";
import { EventsCard } from "./events-card";

export function RightSideBar({ className }: { className?: string }) {
  const { data: session } = useSession();
  const sessionUser = useBoundStore((state) => state.user);

  if (!session || !sessionUser) return null;

  return (
    <aside
      className={`${className} gap mx-auto flex w-full  max-w-xl flex-col space-y-2`}
    >
      <OrgsCard />
      <EventsCard />
    </aside>
  );
}
