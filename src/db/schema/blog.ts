import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  authorId: uuid('author_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
