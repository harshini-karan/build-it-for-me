import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { posts, categories, postCategories } from '@/db/schema';
import { eq, desc, sql, and, inArray } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number()).optional(),
});

const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number()).optional(),
});

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const postsRouter = router({
  // Get all posts with optional filtering
  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        categoryId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        let query = db
          .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            excerpt: posts.excerpt,
            published: posts.published,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts);

        // Filter by category if specified
        if (input?.categoryId) {
          const postIds = await db
            .select({ postId: postCategories.postId })
            .from(postCategories)
            .where(eq(postCategories.categoryId, input.categoryId));
          
          const ids = postIds.map(p => p.postId);
          if (ids.length === 0) return [];
          
          query = query.where(inArray(posts.id, ids)) as any;
        }

        // Filter by published status if specified
        if (input?.published !== undefined) {
          query = query.where(eq(posts.published, input.published)) as any;
        }

        const result = await query.orderBy(desc(posts.createdAt));

        // Get categories for each post
        const postsWithCategories = await Promise.all(
          result.map(async (post) => {
            const postCats = await db
              .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
              })
              .from(postCategories)
              .innerJoin(categories, eq(postCategories.categoryId, categories.id))
              .where(eq(postCategories.postId, post.id));

            return {
              ...post,
              categories: postCats,
            };
          })
        );

        return postsWithCategories;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch posts',
        });
      }
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const [post] = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, input.slug));

        if (!post) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        // Get categories for this post
        const postCats = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, post.id));

        return {
          ...post,
          categories: postCats,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error fetching post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch post',
        });
      }
    }),

  // Get single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const [post] = await db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id));

        if (!post) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        // Get categories for this post
        const postCats = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, post.id));

        return {
          ...post,
          categories: postCats,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error fetching post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch post',
        });
      }
    }),

  // Create new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.title);
        const now = new Date().toISOString();

        // Check if slug already exists
        const [existing] = await db
          .select()
          .from(posts)
          .where(eq(posts.slug, slug));

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A post with this title already exists',
          });
        }

        // Create post
        const [newPost] = await db
          .insert(posts)
          .values({
            title: input.title,
            slug,
            content: input.content,
            excerpt: input.excerpt || input.content.substring(0, 200),
            published: input.published,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        // Add categories if provided
        if (input.categoryIds && input.categoryIds.length > 0) {
          await db.insert(postCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: newPost.id,
              categoryId,
            }))
          );
        }

        return newPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error creating post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create post',
        });
      }
    }),

  // Update post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, categoryIds, ...updateData } = input;

        // Check if post exists
        const [existing] = await db
          .select()
          .from(posts)
          .where(eq(posts.id, id));

        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        // Generate new slug if title is being updated
        let slug = existing.slug;
        if (updateData.title && updateData.title !== existing.title) {
          slug = generateSlug(updateData.title);
          
          // Check if new slug conflicts with another post
          const [conflicting] = await db
            .select()
            .from(posts)
            .where(and(eq(posts.slug, slug), sql`${posts.id} != ${id}`));

          if (conflicting) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A post with this title already exists',
            });
          }
        }

        // Update post
        const [updatedPost] = await db
          .update(posts)
          .set({
            ...updateData,
            slug,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(posts.id, id))
          .returning();

        // Update categories if provided
        if (categoryIds !== undefined) {
          // Remove existing categories
          await db.delete(postCategories).where(eq(postCategories.postId, id));

          // Add new categories
          if (categoryIds.length > 0) {
            await db.insert(postCategories).values(
              categoryIds.map((categoryId) => ({
                postId: id,
                categoryId,
              }))
            );
          }
        }

        return updatedPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error updating post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update post',
        });
      }
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const [existing] = await db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id));

        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        await db.delete(posts).where(eq(posts.id, input.id));

        return { success: true, id: input.id };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error deleting post:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete post',
        });
      }
    }),
});
