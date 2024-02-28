import { type Metadata } from "next";
import Link from "next/link";
import { Card } from "../_components/ui/card";
import { UserAuthForm } from "./user-auth-form";

export const metadata: Metadata = {
  title: "TAILS | Authentication",
  description: "Sign in | Your Hub for Non-Profit Animal Organizations",
};

export default function AuthenticationPage() {
  return (
    <div className="container mt-28">
      <Card className="mx-auto flex w-full max-w-lg flex-col justify-center space-y-6 p-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Your Hub for Non-Profit Animal Organizations
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
