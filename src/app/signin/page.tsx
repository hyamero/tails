"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "~/app/_components/ui/card";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/");
  }

  return (
    <section className="mt-20 flex flex-col items-center justify-center gap-10">
      <h1 className="text-7xl font-bold">
        The Animal Institution for <br /> Lifesaving and Sanctuary
      </h1>

      <Card className="max-w-lg space-y-5">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center justify-between text-2xl">
            <p>Login to proceed</p>
          </CardTitle>
          <CardDescription>
            A collaborative organization dedicated to create a centralized
            platform for Animal Welfare Organizations.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start">
          <Button onClick={() => signIn("google")} className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
