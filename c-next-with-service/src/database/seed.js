import bcrypt from "bcryptjs";
import { count } from "drizzle-orm";
import { db, sql } from "./index";
import { likes, posts, users } from "./schema";

const existing = await db.select({ total: count() }).from(users);

if (existing[0].total > 0) {
  console.log("Seed dilewati: sudah ada pengguna di database.");
  await sql.end();
  process.exit(0);
}

const passwordHash = await bcrypt.hash("rahasia123", 10);

const insertedUsers = await db
  .insert(users)
  .values([
    {
      username: "sena",
      displayName: "Sena",
      passwordHash,
      bio: "Menulis soal kota, kopi, dan hal-hal kecil yang layak diceritakan.",
    },
    {
      username: "bima",
      displayName: "Bima",
      passwordHash,
      bio: "Frontend tinkerer. Sedang belajar menikmati proses.",
    },
    {
      username: "nara",
      displayName: "Nara",
      passwordHash,
      bio: "Desain, buku, dan jalan kaki tanpa tujuan.",
    },
  ])
  .returning({ id: users.id, username: users.username });

const byUsername = Object.fromEntries(
  insertedUsers.map((user) => [user.username, user.id]),
);

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

const insertedPosts = await db
  .insert(posts)
  .values([
    {
      authorId: byUsername.sena,
      content:
        "halo kicau. tempat baru untuk cerita pendek dan percakapan panjang.",
      createdAt: minutesAgo(180),
    },
    {
      authorId: byUsername.bima,
      content:
        "utara kecil: kopi tubruk, buku tipis, dan jendela yang dibiarkan terbuka. kadang yang kita butuh cuma pagi yang tidak terburu-buru.",
      createdAt: minutesAgo(120),
    },
    {
      authorId: byUsername.nara,
      content:
        "hal yang paling saya suka dari redesain: bukan yang ditambahkan, tapi yang berani dihapus.",
      createdAt: minutesAgo(85),
    },
  ])
  .returning({ id: posts.id, authorId: posts.authorId });

const [senaPost, bimaPost, naraPost] = insertedPosts;

const bimaThreadTwo = await db
  .insert(posts)
  .values({
    authorId: byUsername.bima,
    parentId: bimaPost.id,
    content:
      "tapi pagi ini kopinya habis. jadi saya ganti dengan teh, dan ternyata tidak ada yang runtuh.",
    createdAt: minutesAgo(118),
  })
  .returning({ id: posts.id });

const bimaThreadThree = await db
  .insert(posts)
  .values({
    authorId: byUsername.bima,
    parentId: bimaThreadTwo[0].id,
    content:
      "akhir utas. kalau kamu punya ritual pagi yang sederhana, ceritakan. saya sedang mengumpulkan alasan untuk bangun lebih awal.",
    createdAt: minutesAgo(116),
  })
  .returning({ id: posts.id });

await db.insert(posts).values([
  {
    authorId: byUsername.sena,
    parentId: bimaPost.id,
    content: "versi teh juga tidak kalah tenang. setuju soal jendela.",
    createdAt: minutesAgo(100),
  },
  {
    authorId: byUsername.nara,
    parentId: bimaThreadThree[0].id,
    content: "ritual saya: buka jendela lima menit sebelum buka layar.",
    createdAt: minutesAgo(90),
  },
  {
    authorId: byUsername.sena,
    parentId: naraPost.id,
    content:
      "menghapus itu keputusan desain yang paling sulit, tapi paling jujur.",
    createdAt: minutesAgo(60),
  },
]);

const allPosts = await db.select({ id: posts.id }).from(posts);
const likeRows = [];

for (const post of allPosts) {
  if (post.id !== senaPost.id) {
    likeRows.push({ postId: post.id, userId: byUsername.sena });
  }
  if (post.id !== bimaPost.id) {
    likeRows.push({ postId: post.id, userId: byUsername.bima });
  }
  if (post.id !== naraPost.id) {
    likeRows.push({ postId: post.id, userId: byUsername.nara });
  }
}

await db.insert(likes).values(likeRows).onConflictDoNothing();

console.log("Seed selesai. Akun demo: sena, bima, nara / rahasia123");
await sql.end();
