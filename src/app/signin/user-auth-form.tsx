"use client";

import * as React from "react";
import { Button } from "../_components/ui/button";
import { Icons } from "../_components/icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UserAuthForm() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <div className="grid gap-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            continue with
          </span>
        </div>
      </div>
      <Button
        type="button"
        className="font-semibold"
        onClick={() => signIn("google")}
      >
        <Icons.google className=" mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
