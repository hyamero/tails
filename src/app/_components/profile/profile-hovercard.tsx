"use client";

import { toast } from "sonner";
import type { User } from "~/lib/types";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { ProfileCard } from "./profile-card";

type ProfileHoverCardProps = {
  children: React.ReactNode;
  author: User;
  userId: string | undefined;
};

export function ProfileHoverCard({
  children,
  author,
  userId,
}: ProfileHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ProfileCard author={author} />
        {author.id !== userId && (
          <Button
            title="follow"
            onClick={() => toast.info("Feature coming soon!")}
            className="mt-4 w-full"
          >
            Follow
          </Button>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
