import { api } from "~/trpc/server";
import UserProfile from "../../_components/profile/user-profile";
import type { User } from "~/lib/types";
import { LeftSideBar } from "~/app/_components/sidebar/left-sidebar";
import { RightSideBar } from "~/app/_components/sidebar/right-sidebar";

const removeSlug = (param: string) => {
  return param.startsWith("%40") ? param.split("%40").at(1) : param;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const userId = removeSlug(params.slug);

  const user = (await api.user.getUser.query({
    id: userId!,
    columns: {
      username: true,
      name: true,
    },
  })) as User;

  const title = user
    ? `${user.name} (@${user.username}) on TAILS`
    : "User not found | TAILS";

  return {
    title: title,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const userId = removeSlug(params.slug);

  const user = (await api.user.getUser.query({
    id: userId!,
    columns: {
      id: true,
      username: true,
      name: true,
      image: true,
      userType: true,
      createdAt: true,
    },
  })) as User;

  return (
    <main className="grid-row-2 flex min-h-screen grid-cols-4 flex-col items-start gap-5 pb-20 pt-7 md:pb-20  lg:grid">
      <LeftSideBar />
      <UserProfile user={user} className="col-span-2 col-start-2" />
      <RightSideBar className="hidden lg:block" />
    </main>
  );
}
