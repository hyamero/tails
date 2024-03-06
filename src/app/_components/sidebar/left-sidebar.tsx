"use client";

import { type User } from "~/lib/types";
import { useSession } from "next-auth/react";
import { useBoundStore } from "~/lib/utils/use-bound-store";
import { BudgetStats } from "../payment/budget-stats";
import { UploadDropzone } from "~/lib/utils/uploadthing";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { ProfileCard } from "../profile/profile-card";
import { Card } from "../ui/card";
import { DonationDrawer } from "../payment/donation-drawer";
import { toast } from "sonner";

export function LeftSideBar() {
  const { data: session } = useSession();
  const sessionUser = useBoundStore((state) => state.user);

  if (!session || !sessionUser) return null;

  return (
    <aside className="mx-auto w-full max-w-xl space-y-2">
      <Card className="flex items-center justify-between space-x-4 p-5">
        <ProfileCard author={{ ...session.user, ...sessionUser } as User} />
      </Card>

      {sessionUser.userType === "org" && (
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
      )}
      <DonationDrawer />

      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          toast.success("Image uploaded successfully!");
        }}
        onUploadError={(error: Error) => {
          toast.error(`ERROR! ${error.message}`);
        }}
        onUploadBegin={() => {
          toast.info("Uploading image...");
        }}
      />
    </aside>
  );
}
