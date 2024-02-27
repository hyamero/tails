"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";

import { type User } from "~/lib/types";
import { Feed } from "~/app/_components/post/feed";
import { EditUserModal } from "./edit-profile-modal";
import { Button } from "../ui/button";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { useSession } from "next-auth/react";

export default function UserProfile({ user }: { user?: User }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session } = useSession();
  const isCurrentUser = session?.user?.id === user?.id;

  useEffect(() => {
    if (user?.username) {
      const newUrl = `@${user.username}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl,
      );
    }
  }, [user?.username]);

  if (!user) {
    return <NoUser />;
  }

  const username = () => {
    if (user.username) {
      return "@" + user.username;
    } else {
      return null;
    }
  };

  return (
    mounted && (
      <main className="container mx-auto max-w-xl">
        <section>
          <div className="flex items-center justify-between py-5">
            <div>
              <p className="text-3xl font-bold">{user.name}</p>
              <span className="text-muted-foreground">{username()}</span>
            </div>
            <Avatar className="h-24 w-24">
              <AvatarImage
                className="rounded-full"
                src={user.image as string | undefined}
                alt={`${user.name}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {user.name?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          {isCurrentUser ? (
            <EditUserModal user={user} />
          ) : (
            <div className="flex gap-2">
              <Button
                title="Follow"
                type="button"
                variant="outline"
                onClick={() => toast.info("Feature coming soon!")}
                className=" w-full"
              >
                Follow
              </Button>

              <Button
                title="Mention"
                type="button"
                variant="outline"
                onClick={() => toast.info("Feature coming soon!")}
                className=" w-full"
              >
                Mention
              </Button>
            </div>
          )}
        </section>

        <Tabs defaultValue="posts" className="mt-5 w-full">
          <TabsList className="w-full border-b bg-transparent">
            <TabsTrigger value="posts" className="w-full">
              Posts
            </TabsTrigger>
            <TabsTrigger value="replies" className="w-full">
              Replies
            </TabsTrigger>
            <TabsTrigger value="likes" className="w-full">
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {/* User Feed with authorId param
       to list user's posts */}
            <Feed authorId={user.id} />
          </TabsContent>

          <TabsContent value="replies">
            <div className="flex justify-center pt-10 text-xl font-semibold">
              Replies tab coming soon..
            </div>
          </TabsContent>

          <TabsContent value="likes">
            <div className="flex justify-center pt-10 text-xl font-semibold">
              Likes tab coming soon..
            </div>
          </TabsContent>
        </Tabs>
      </main>
    )
  );
}

const NoUser = () => {
  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-12 px-4 py-16 ">
      <p className="text-center text-2xl text-white">User not found</p>
      <Link
        href={"/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        Sign in
      </Link>
    </div>
  );
};
