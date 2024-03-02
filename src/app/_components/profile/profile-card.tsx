"use client";

import Link from "next/link";
import type { User } from "~/lib/types";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

type ProfileHoverCardProps = {
  author: User;
};

export function ProfileCard({ author }: ProfileHoverCardProps) {
  const userSlug = author.username ? "@" + author.username : author.id;

  const joined = author.createdAt
    ? "Joined " + format(new Date(author.createdAt), "MMMM yyyy")
    : "";

  return (
    <div className="flex w-full items-center justify-between space-x-4">
      <div className="space-y-3">
        <div>
          <h4 className="text-lg font-semibold">{author.name}</h4>
          {author.username && (
            <h4 className="text-sm font-normal text-muted-foreground">
              {"@" + author.username}
            </h4>
          )}
        </div>
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
          <span className="text-xs text-muted-foreground">{joined}</span>
        </div>
      </div>

      <Link href={`/user/${userSlug}`} className="font-semibold">
        <Avatar className="h-16 w-16">
          <AvatarImage
            className="rounded-full"
            src={author.image as string | undefined}
            alt={`${author.name}'s avatar`}
          />
          <AvatarFallback className="text-xs">
            {author.name?.split(" ").at(0)}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
