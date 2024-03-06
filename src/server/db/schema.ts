import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `tails_${name}`);

/**
 * Posts
 */

export const posts = createTable(
  "post",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    authorId: varchar("authorId", { length: 255 }).notNull(),
    parentId: varchar("parentId", { length: 255 }),
    content: varchar("content", { length: 500 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (post) => ({
    authorIdIdx: index("authorId_idx").on(post.authorId),
    parentIdIdx: index("parentId_idx").on(post.parentId),
  }),
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  likes: many(likes),
  posts: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "replies",
  }),
  replies: many(posts, { relationName: "replies" }),
}));

/**
 * Likes
 */

export const likes = createTable(
  "like",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    postId: varchar("postId", { length: 255 }).notNull(),
  },
  (like) => {
    return {
      compoundKey: primaryKey({
        columns: [like.userId, like.postId],
      }),
      userIdIdx: index("userId_idx").on(like.userId),
      postIdIdx: index("postId_idx").on(like.postId),
    };
  },
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
}));

/**
 * Donation
 */

export const donations = createTable(
  "donation",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    donorId: varchar("donorId", { length: 255 }).notNull(),
    recipientId: varchar("recipient", { length: 255 }).notNull(),
    amount: int("amount").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (donation) => ({
    donorIdIdx: index("userId_idx").on(donation.donorId),
    recipientIdIdx: index("recipientId_idx").on(donation.recipientId),
  }),
);

export const donationRelations = relations(donations, ({ one }) => ({
  donor: one(users, { fields: [donations.donorId], references: [users.id] }),
  recipient: one(users, {
    fields: [donations.recipientId],
    references: [users.id],
  }),
}));

/**
 * Animals
 */

export const animals = createTable(
  "animal",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    species: varchar("species", { length: 255 }).notNull(),
    breed: varchar("breed", { length: 255 }),
    birthday: timestamp("birthday", { mode: "date" }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (animal) => ({
    nameIdx: index("name_idx").on(animal.name),
    speciesIdx: index("species_idx").on(animal.species),
  }),
);

/**
 * Adoptions
 */

export const adoptions = createTable(
  "adoption",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    animalId: varchar("animalId", { length: 255 }).notNull(),
    adopterId: varchar("adopterId", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (adoption) => ({
    animalIdIdx: index("animalId_idx").on(adoption.animalId),
    adopterIdIdx: index("adopterId_idx").on(adoption.adopterId),
  }),
);

export const adoptionsRelations = relations(adoptions, ({ one }) => ({
  animal: one(animals, {
    fields: [adoptions.animalId],
    references: [animals.id],
  }),
  adopter: one(users, {
    fields: [adoptions.adopterId],
    references: [users.id],
  }),
}));

/**
 * Users
 */

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  userType: mysqlEnum("userType", ["user", "admin", "org"]).notNull(),
  username: varchar("username", { length: 30 }).unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
