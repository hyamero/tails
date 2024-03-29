"use client";

import Link from "next/link";
import { type Session } from "next-auth";

import {
  PiHouseFill,
  PiHeartBold,
  PiQuotesFill,
  PiMagnifyingGlassBold,
} from "react-icons/pi";

import { BiUser } from "react-icons/bi";
import { CgMenuRight } from "react-icons/cg";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_components/ui/sheet";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useBoundStore } from "~/lib/utils/use-bound-store";
import { useSession } from "next-auth/react";
import { type User } from "~/lib/types";
import { useEffect } from "react";

export function Navbar({ sessionUser }: { sessionUser: User | null }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const setSessionUser = useBoundStore((state) => state.setSessionUser);

  useEffect(() => {
    setSessionUser(sessionUser);
  }, [sessionUser, setSessionUser]);

  if (status === "authenticated" && !sessionUser?.username) {
    router.push("/new-user");
  }

  const togglePostFormIsOpen = useBoundStore(
    (state) => state.modalActions.togglePostFormIsOpen,
  );

  const toggleLoginModalIsOpen = useBoundStore(
    (state) => state.modalActions.toggleLoginModalIsOpen,
  );

  const slugParam = sessionUser?.username
    ? "@" + sessionUser?.username
    : sessionUser?.id;

  return (
    <nav>
      <div className="fixed left-0 right-0 top-0 z-50 w-full py-7 backdrop-blur-xl backdrop-filter md:z-40">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-3 items-center">
          <Link
            href="/"
            aria-label="logo button"
            className="col-start-2 place-self-center text-xl font-bold md:col-start-1 md:ml-7 md:place-self-start"
          >
            TAILS
          </Link>

          <BurgerMenu user={sessionUser} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-screen-sm items-center justify-center gap-3 bg-opacity-40 bg-clip-padding p-2 text-3xl backdrop-blur-xl backdrop-filter sm:px-10 md:bottom-auto md:top-0 md:z-50 md:bg-transparent md:px-14 md:text-[1.75rem] md:backdrop-blur-none [&>*:hover]:bg-zinc-100 [&>*]:flex [&>*]:w-full [&>*]:justify-center [&>*]:rounded-lg [&>*]:py-5 [&>*]:text-center [&>*]:text-muted-foreground [&>*]:transition-colors [&>*]:duration-300">
        <Link href="/" aria-label="home button" className="hover:bg-zinc-100">
          <PiHouseFill className="text-center" />
        </Link>

        <button type="button" title="search">
          <PiMagnifyingGlassBold />
        </button>

        <button
          title="create a post"
          onClick={() => {
            if (status === "authenticated") {
              togglePostFormIsOpen();
            } else {
              toggleLoginModalIsOpen();
            }
          }}
          type="button"
        >
          <PiQuotesFill />
        </button>

        <button type="button" title="notifications">
          <PiHeartBold />
        </button>

        <Link
          href={`/user/${slugParam}`}
          title="profile"
          onClick={() => {
            if (!session) toggleLoginModalIsOpen();
          }}
        >
          <BiUser />
        </Link>
      </div>
    </nav>
  );
}

const BurgerMenu = ({ user }: { user: Session["user"] | null | undefined }) => {
  return (
    <Sheet>
      <SheetTrigger
        title="menu"
        className="col-start-3 mr-7 place-self-end self-center text-3xl text-zinc-500 md:text-[1.75rem]"
      >
        <CgMenuRight />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="mr-2">
            {user
              ? "Logged in as" + user.name
              : " The Animal Institution for Lifesaving and Sanctuary (TAILS)"}
          </SheetTitle>
          <SheetDescription>
            Your Hub for Non-Profit Animal Organizations
          </SheetDescription>
        </SheetHeader>
        <Link
          aria-label="Sign in or Sign out"
          href={user ? "/signout" : "/signin"}
        >
          <SheetTrigger className="mt-5 w-full">
            <Button className="w-full">{user ? "Sign out" : "Sign in"}</Button>
          </SheetTrigger>
        </Link>
      </SheetContent>
    </Sheet>
  );
};
