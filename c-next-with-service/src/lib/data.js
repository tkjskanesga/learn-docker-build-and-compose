import "server-only";

import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  ne,
  or,
} from "drizzle-orm";
import { db } from "@/database";
import { likes, posts, users } from "@/database/schema";

const postSelection = {
  id: posts.id,
  content: posts.content,
  parentId: posts.parentId,
  createdAt: posts.createdAt,
  authorId: users.id,
  username: users.username,
  displayName: users.displayName,
};

function shape(row, replyCount, likeCount, liked) {
  return {
    id: row.id,
    content: row.content,
    parentId: row.parentId,
    createdAt: row.createdAt,
    author: {
      id: row.authorId,
      username: row.username,
      displayName: row.displayName,
    },
    replyCount,
    likeCount,
    liked,
  };
}

async function decoratePosts(rows, viewerId) {
  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.id);

  const [replyRows, likeRows, viewerLikeRows] = await Promise.all([
    db
      .select({ postId: posts.parentId, total: count() })
      .from(posts)
      .where(inArray(posts.parentId, ids))
      .groupBy(posts.parentId),
    db
      .select({ postId: likes.postId, total: count() })
      .from(likes)
      .where(inArray(likes.postId, ids))
      .groupBy(likes.postId),
    viewerId
      ? db
          .select({ postId: likes.postId })
          .from(likes)
          .where(and(inArray(likes.postId, ids), eq(likes.userId, viewerId)))
      : Promise.resolve([]),
  ]);

  const replyMap = new Map(
    replyRows.map((row) => [row.postId, Number(row.total)]),
  );
  const likeMap = new Map(
    likeRows.map((row) => [row.postId, Number(row.total)]),
  );
  const likedSet = new Set(viewerLikeRows.map((row) => row.postId));

  return rows.map((row) =>
    shape(
      row,
      replyMap.get(row.id) ?? 0,
      likeMap.get(row.id) ?? 0,
      likedSet.has(row.id),
    ),
  );
}

export async function getFeed(viewerId) {
  const rows = await db
    .select(postSelection)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(isNull(posts.parentId))
    .orderBy(desc(posts.createdAt))
    .limit(30);

  return decoratePosts(rows, viewerId);
}

export async function getPostById(id, viewerId) {
  const rows = await db
    .select(postSelection)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  const [post] = await decoratePosts(rows, viewerId);
  return post ?? null;
}

export async function getReplies(postId, viewerId) {
  const rows = await db
    .select(postSelection)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.parentId, postId))
    .orderBy(posts.createdAt)
    .limit(50);

  return decoratePosts(rows, viewerId);
}

export async function getThread(postId, viewerId) {
  const post = await getPostById(postId, viewerId);

  if (!post) {
    return null;
  }

  const ancestors = [];
  let parentId = post.parentId;

  while (parentId && ancestors.length < 25) {
    const parent = await getPostById(parentId, viewerId);
    if (!parent) {
      break;
    }
    ancestors.unshift(parent);
    parentId = parent.parentId;
  }

  const replies = await getReplies(post.id, viewerId);
  return { post, ancestors, replies };
}

export async function getProfile(username) {
  const [profile] = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!profile) {
    return null;
  }

  const [[postStats], [likeStats]] = await Promise.all([
    db
      .select({ total: count() })
      .from(posts)
      .where(eq(posts.authorId, profile.id)),
    db
      .select({ total: count() })
      .from(likes)
      .innerJoin(posts, eq(likes.postId, posts.id))
      .where(eq(posts.authorId, profile.id)),
  ]);

  return {
    ...profile,
    postCount: Number(postStats.total),
    likeCount: Number(likeStats.total),
  };
}

export async function getUserPosts(userId, viewerId, tab = "posts") {
  const where =
    tab === "replies"
      ? and(eq(posts.authorId, userId), isNotNull(posts.parentId))
      : and(eq(posts.authorId, userId), isNull(posts.parentId));

  const rows = await db
    .select(postSelection)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(where)
    .orderBy(desc(posts.createdAt))
    .limit(30);

  return decoratePosts(rows, viewerId);
}

export async function getSuggestedUsers(viewerId) {
  return db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      bio: users.bio,
    })
    .from(users)
    .where(ne(users.id, viewerId))
    .orderBy(desc(users.createdAt))
    .limit(3);
}

export async function searchPosts(query, viewerId) {
  const rows = await db
    .select(postSelection)
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(ilike(posts.content, `%${query}%`))
    .orderBy(desc(posts.createdAt))
    .limit(20);

  return decoratePosts(rows, viewerId);
}

export async function searchUsers(query) {
  return db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      bio: users.bio,
    })
    .from(users)
    .where(
      or(
        ilike(users.username, `%${query}%`),
        ilike(users.displayName, `%${query}%`),
      ),
    )
    .orderBy(users.username)
    .limit(5);
}
