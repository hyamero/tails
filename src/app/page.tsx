import { Feed } from "./_components/post/feed";
import { SideBar } from "./_components/sidebar/sidebar";

export default async function Home() {
  return (
    <main className="container grid min-h-screen grid-cols-4 items-start pt-7 text-white">
      <SideBar />
      <Feed className="col-span-2 col-start-2" />
    </main>
  );
}
