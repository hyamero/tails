import { api } from "~/trpc/server";
import type { Post, User } from "~/lib/types";
import { Feed } from "~/app/_components/post/feed";
import { PostItem } from "~/app/_components/post/post-item";
import { CreateComment } from "~/app/_components/comment/create-comment";
// import TempComments from "~/app/_components/comment/temp-comments";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const removeSlug = (param: string) => {
    return param.startsWith("%40") ? param.split("%40").at(1) : param;
  };

  const userId = removeSlug(params.slug);

  const user = (await api.user.getUser.query({
    id: userId!,
    columns: {
      username: true,
      name: true,
    },
  })) as User;

  const title = user
    ? `${user.name} (@${user.username}) post on Quotia`
    : "User not found | Quotia";

  return {
    title: title,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await api.post.getPost.query({ postId: params.id });

  if (!post) return <p>Post not found.</p>;

  return (
    <div className="container mt-10 max-w-2xl">
      <CreateComment />
      <PostItem post={post as Post} />
      <div className="ml-10 h-10 w-[1.5px] bg-muted-foreground"></div>
      <div className="rounded-3xl">
        {/* <TempComments /> */}
        <Feed postId={post?.id} />
      </div>
    </div>
  );
}
