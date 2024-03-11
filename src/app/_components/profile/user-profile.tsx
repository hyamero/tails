"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
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
import { useRouter } from "next/navigation";
import { RecentDonations } from "../payment/recent-donations";

export default function UserProfile({
  user,
  className,
}: {
  user?: User;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const { data: session, status } = useSession();
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

  if (status === "authenticated" && !user?.username) {
    router.push("/new-user");
  }

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
      <main className={`w-full ${className}`}>
        <section className="mx-auto w-full max-w-xl">
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
          <TabsContents
            username={user.username}
            userId={user.id}
            userType={user.userType}
          />
        </section>
      </main>
    )
  );
}

const TabsContents = ({
  userId,
  userType,
  username,
}: {
  userId: string;
  userType: User["userType"];
  username: string;
}) => {
  const userContents = [
    {
      component: () => <Feed authorId={userId} />,
      value: "posts",
    },
    {
      component: () => (
        <div className="flex justify-center pt-10 text-xl font-semibold">
          Coming soon!
        </div>
      ),
      value: "activity",
    },
    {
      component: () => (
        <div className="flex justify-center pt-10 text-xl font-semibold">
          Coming soon!
        </div>
      ),
      value: "orgs",
    },
  ];

  const orgContents = [
    {
      component: () => <Feed authorId={userId} />,
      value: "posts",
    },
    {
      component: () => <RecentDonations recipient={username} />,
      value: "activity",
    },
    {
      component: () => (
        <div className="flex justify-center pt-10 text-xl font-semibold">
          Coming soon!
        </div>
      ),
      value: "fosters",
    },
  ];

  const contents = userType === "user" ? userContents : orgContents;

  return (
    <Tabs defaultValue="posts" className="mt-5 w-full">
      <TabsList className="w-full border-b">
        {contents.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="w-full capitalize"
          >
            {tab.value}
          </TabsTrigger>
        ))}
      </TabsList>

      {contents.map((content) => {
        const Component = content.component;

        return (
          <TabsContent
            key={content.value}
            value={content.value}
            className="pt-5"
          >
            <Component />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

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
