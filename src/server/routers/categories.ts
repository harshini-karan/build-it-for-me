import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { categories, postCategories, posts } from '@/db/schema';
import { eq, sql, and, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const categoriesRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    try {
      const allCategories = await db
        .select()
        .from(categories)
        .orderBy(categories.name);

      // Get post count for each category
      const categoriesWithCount = await Promise.all(
        allCategories.map(async (category) => {
          const [result] = await db
            .select({ count: sql<number>`count(*)` })
            .from(postCategories)
            .where(eq(postCategories.categoryId, category.id));

          return {
            ...category,
            postCount: Number(result?.count || 0),
          };
        })
      );

      return categoriesWithCount;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch categories',
      });
    }
  }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const [category] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, input.id));

        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        // Get post count
        const [result] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postCategories)
          .where(eq(postCategories.categoryId, category.id));

        return {
          ...category,
          postCount: Number(result?.count || 0),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error fetching category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch category',
        });
      }
    }),

  // Get single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const [category] = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, input.slug));

        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        // Get post count
        const [result] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postCategories)
          .where(eq(postCategories.categoryId, category.id));

        return {
          ...category,
          postCount: Number(result?.count || 0),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error fetching category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch category',
        });
      }
    }),

  // Create new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const slug = generateSlug(input.name);
        const now = new Date().toISOString();

        // Check if slug already exists
        const [existing] = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, slug));

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A category with this name already exists',
          });
        }

        const [newCategory] = await db
          .insert(categories)
          .values({
            name: input.name,
            slug,
            description: input.description,
            createdAt: now,
          })
          .returning();

        return newCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error creating category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create category',
        });
      }
    }),

  // Update category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        // Check if category exists
        const [existing] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, id));

        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        // Generate new slug if name is being updated
        let slug = existing.slug;
        if (updateData.name && updateData.name !== existing.name) {
          slug = generateSlug(updateData.name);
          
          // Check if new slug conflicts with another category
          const [conflicting] = await db
            .select()
            .from(categories)
            .where(and(eq(categories.slug, slug), sql`${categories.id} != ${id}`));

          if (conflicting) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A category with this name already exists',
            });
          }
        }

        const [updatedCategory] = await db
          .update(categories)
          .set({
            ...updateData,
            slug,
          })
          .where(eq(categories.id, id))
          .returning();

        return updatedCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error updating category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update category',
        });
      }
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const [existing] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, input.id));

        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        // Check if category is being used
        const [usage] = await db
          .select({ count: sql<number>`count(*)` })
          .from(postCategories)
          .where(eq(postCategories.categoryId, input.id));

        if (usage && Number(usage.count) > 0) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: `Cannot delete category that is assigned to ${usage.count} post(s)`,
          });
        }

        await db.delete(categories).where(eq(categories.id, input.id));

        return { success: true, id: input.id };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('Error deleting category:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete category',
        });
      }
    }),
});
