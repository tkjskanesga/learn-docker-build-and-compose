import { notFound } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { Composer } from "@/components/composer";
import { PostCard } from "@/components/post-card";
import { requireUser } from "@/lib/auth";
import { getThread } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    return { title: "Kiriman tidak ditemukan" };
  }

  return { title: `Kiriman #${postId}` };
}

export default async function ThreadPage({ params }) {
  const user = await requireUser();
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const thread = await getThread(postId, user.id);

  if (!thread) {
    notFound();
  }

  const { post, ancestors, replies } = thread;

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[53px] items-center gap-4 border-b border-line bg-background/85 px-4 backdrop-blur-md">
        <BackButton />
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-bold leading-tight">Utas</h1>
          <p className="truncate text-[12.5px] text-muted">
            {post.replyCount > 0
              ? `${post.replyCount} balasan`
              : "Belum ada balasan"}
          </p>
        </div>
      </header>

      <div>
        {ancestors.map((ancestor) => (
          <PostCard key={ancestor.id} post={ancestor} showRail />
        ))}

        <PostCard post={post} variant="detail" />

        <Composer
          user={user}
          parentId={post.id}
          redirectTo={`/p/${post.id}`}
          placeholder={`Balas sebagai @${user.username}`}
          variant="feed"
        />

        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <h2 className="text-[15px] font-bold">
            Balasan{" "}
            <span className="font-normal text-muted">{post.replyCount}</span>
          </h2>
        </div>

        {replies.length === 0 ? (
          <p className="px-4 py-10 text-center text-[14px] text-muted">
            Belum ada balasan. Jadilah yang pertama menimpali.
          </p>
        ) : (
          replies.map((reply) => <PostCard key={reply.id} post={reply} />)
        )}
      </div>
    </>
  );
}
