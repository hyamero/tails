"use client";

import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { api } from "~/trpc/react";
import type { Post } from "~/lib/types";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { formatDistance } from "~/lib/hooks/format-distance";
import { formatDistanceToNowStrict, formatRelative } from "date-fns";
import { useBoundStore } from "~/lib/utils/use-bound-store";
import { useSession } from "next-auth/react";
import { AspectRatio } from "../ui/aspect-ratio";

import { PiChatCircle, PiHeart, PiHeartFill } from "react-icons/pi";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { PostDropdownMenu } from "./post-dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

import { ProfileHoverCard } from "../profile/profile-hovercard";
import { ViewLikes } from "./view-likes";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DonationDrawer } from "../payment/donation-drawer";

type PostItemProps = {
  post: Post;
  postType?: "post" | "comment";
};

export function PostItem({ post, postType = "post" }: PostItemProps) {
  const { data: session } = useSession();

  const pathname = usePathname();

  const userSlug = post.author.username
    ? "@" + post.author.username
    : post.authorId;

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl items-start justify-between rounded-sm border bg-background p-5">
        <div className="flex w-full flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/user/${userSlug}`} className="font-semibold">
                <Avatar>
                  <AvatarImage
                    className="rounded-full"
                    src={post.author.image as string | undefined}
                    alt={`${post.author.name}'s avatar`}
                  />
                  <AvatarFallback className="text-xs text-muted-foreground">
                    {post.author.name?.split(" ").at(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <ProfileHoverCard
                  author={post.author}
                  userId={session?.user.id}
                >
                  <Link
                    href={`/user/${userSlug}`}
                    className="font-semibold text-foreground hover:underline"
                  >
                    {post.author.name}
                  </Link>
                </ProfileHoverCard>
                <p className="text-xs text-muted-foreground">Description...</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="select-none text-muted-foreground">
                      {formatDistanceToNowStrict(post.createdAt, {
                        addSuffix: false,
                        locale: {
                          formatDistance: (...props) =>
                            formatDistance(...props),
                        },
                      })}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{formatRelative(post.createdAt, new Date())}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* 
               DropDownMenu
              */}
              {postType === "post" && (
                <PostDropdownMenu postId={post.id} postAuthor={post.authorId} />
              )}
            </div>
          </div>

          <div>
            {!pathname.includes("/post") && postType === "post" ? (
              <Link
                href={`/user/${userSlug}/post/${post.id}`}
                className="whitespace-pre-wrap text-foreground"
              >
                {post.content}
              </Link>
            ) : (
              <p className="whitespace-pre-wrap">{post.content}</p>
            )}

            {post.imageLink && (
              <Dialog>
                <DialogTrigger asChild className="cursor-pointer">
                  <AspectRatio
                    ratio={16 / 9}
                    className="my-3 rounded-md bg-muted"
                  >
                    <Image
                      src={post.imageLink}
                      alt="post image"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                </DialogTrigger>
                <DialogContent className="w-screen max-w-[80%] rounded-md xl:max-w-[60%]">
                  <AspectRatio
                    ratio={16 / 9}
                    className="mt-2 rounded-md bg-muted"
                  >
                    <Image
                      src={post.imageLink}
                      alt="post image"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                  <PostButtons post={post} postType={postType} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <PostButtons post={post} postType={postType} />
        </div>
      </div>
    </>
  );
}

const PostButtons = ({ post, postType }: PostItemProps) => {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const toggleCommentFormIsOpen = useBoundStore(
    (state) => state.modalActions.toggleCommentFormIsOpen,
  );

  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [likes, setLikes] = useState(
    likeCount === 0 ? "" : likeCount === 1 ? "like" : "likes",
  );

  const toggleLike = api.post.toggleLike.useMutation({
    onError: () => {
      toast.error("Something went wrong. Please try again.");
      setLikedByUser(!likedByUser);
    },
  });

  useEffect(() => {
    setLikes(likeCount === 0 ? "" : likeCount === 1 ? "like" : "likes");
  }, [likeCount]);

  const handleToggleLikeCount = () => {
    if (!session) {
      toast("Not logged in?", {
        description: "You must be logged in to like a post.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/api/auth/signin"),
        },
      });

      return;
    }

    setLikedByUser(!likedByUser);
    setLikeCount(likedByUser ? likeCount - 1 : likeCount + 1);

    toggleLike.mutate({ postId: post.id });
  };

  const repliesWord =
    post.replies === 0 ? "" : post.replies === 1 ? "reply" : "replies";

  const handleReply = () => {
    if (!session) {
      toast("Not logged in?", {
        description: "You must be logged in to like a post.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/api/auth/signin"),
        },
      });

      return;
    }

    toggleCommentFormIsOpen(post);

    toggleLike.mutate({ postId: post.id });
  };

  const [likesModalIsOpen, setLikesModalIsOpen] = useState(false);
  likesModalIsOpen;

  return (
    postType === "post" && (
      <>
        <ViewLikes
          postId={post.id}
          likesModalIsOpen={likesModalIsOpen}
          setLikesModalIsOpen={setLikesModalIsOpen}
        />

        <div className="flex items-center justify-between">
          <div className="relative right-[0.4rem] mt-[6px] text-foreground">
            <button
              title="like"
              type="button"
              className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-100"
              onClick={handleToggleLikeCount}
            >
              {likedByUser ? (
                <PiHeartFill className="transform text-2xl text-red-500 transition-transform active:scale-90" />
              ) : (
                <PiHeart className="transform text-2xl transition-transform active:scale-90" />
              )}
            </button>

            <button
              title="comment"
              type="button"
              className="rounded-full p-[0.4rem] transition-colors duration-200 hover:bg-zinc-100"
              onClick={handleReply}
            >
              <PiChatCircle className="text-2xl" />
            </button>
          </div>

          {post.params?.includes("donation") && (
            <DonationDrawer orgId={post.author.username ?? post.authorId} />
          )}
        </div>

        <div className="space-x-3">
          {!pathname.includes(post.id) && post.replies ? (
            <Link
              className="text-muted-foreground"
              href={`/user/${post.author.username ?? post.authorId}/post/${
                post.id
              }`}
            >
              {post.replies + " " + repliesWord}
            </Link>
          ) : null}
          <span
            className="cursor-pointer text-zinc-500"
            onClick={() => setLikesModalIsOpen(!likesModalIsOpen)}
          >
            {(likeCount ? likeCount : "") + " " + likes}
          </span>
        </div>
      </>
    )
  );
};
