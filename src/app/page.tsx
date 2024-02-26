import { Feed } from "./_components/post/feed";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-white">
      <Feed />
    </main>
  );
}
