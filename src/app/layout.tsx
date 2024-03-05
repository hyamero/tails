import "~/styles/globals.css";

import { Inter } from "next/font/google";
import "@uploadthing/react/styles.css";

import { api } from "~/trpc/server";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import AuthProvider from "./context/client-auth-provider";

import { LoginModal } from "./_components/modal/modals";
import { Toaster } from "./_components/ui/sonner";
import { Navbar } from "./_components/navbar";
import NextTopLoader from "nextjs-toploader";
import { type User } from "~/lib/types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TAILS",
  description: "The Animal Institution for Lifesaving and Sanctuary ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  const sessionUser =
    session &&
    ((await api.user.getUser.query({
      id: session?.user?.id ?? "",
      columns: {
        username: true,
        name: true,
        createdAt: true,
        userType: true,
      },
    })) as User);

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <NextTopLoader />
        <Toaster />
        <TRPCReactProvider>
          <AuthProvider session={session}>
            <Navbar sessionUser={sessionUser} />
            <LoginModal />
            <div className="pt-24">{children}</div>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
