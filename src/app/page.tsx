import { Feed } from "./_components/post/feed";
import { LeftSideBar } from "./_components/sidebar/left-sidebar";

export default async function Home() {
  return (
    <main className="grid-row-2 container flex min-h-screen grid-cols-4 flex-col items-start gap-5 pt-7 text-white lg:grid">
      <LeftSideBar />
      <Feed className="col-span-2 col-start-2" />
    </main>
  );
}
