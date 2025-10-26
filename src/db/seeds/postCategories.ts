import { db } from '@/db';
import { posts, categories, postCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    // Query existing posts and categories
    const existingPosts = await db.select().from(posts);
    const existingCategories = await db.select().from(categories);

    // Create maps for easy lookup
    const postMap = new Map(existingPosts.map(post => [post.slug, post.id]));
    const categoryMap = new Map(existingCategories.map(cat => [cat.slug, cat.id]));

    // Define post-category relationships
    const relationships = [
        {
            postSlug: 'getting-started-with-nextjs-15',
            categorySlugs: ['technology', 'web-development', 'tutorial']
        },
        {
            postSlug: 'building-scalable-applications',
            categorySlugs: ['technology', 'best-practices']
        },
        {
            postSlug: 'typescript-best-practices',
            categorySlugs: ['web-development', 'tutorial', 'best-practices']
        },
        {
            postSlug: 'understanding-trpc',
            categorySlugs: ['technology', 'web-development', 'tutorial']
        },
        {
            postSlug: 'modern-react-patterns',
            categorySlugs: ['web-development', 'best-practices']
        },
        {
            postSlug: 'database-design-principles',
            categorySlugs: ['technology', 'best-practices', 'tutorial']
        },
        {
            postSlug: 'api-security-best-practices',
            categorySlugs: ['technology', 'best-practices']
        },
        {
            postSlug: 'serverless-architecture-guide',
            categorySlugs: ['technology', 'web-development', 'news']
        }
    ];

    // Create post-category associations
    const postCategoryRelations = [];

    for (const relation of relationships) {
        const postId = postMap.get(relation.postSlug);
        
        if (!postId) {
            console.warn(`⚠️ Post not found: ${relation.postSlug}`);
            continue;
        }

        for (const categorySlug of relation.categorySlugs) {
            const categoryId = categoryMap.get(categorySlug);
            
            if (!categoryId) {
                console.warn(`⚠️ Category not found: ${categorySlug}`);
                continue;
            }

            postCategoryRelations.push({
                postId,
                categoryId
            });
        }
    }

    if (postCategoryRelations.length > 0) {
        await db.insert(postCategories).values(postCategoryRelations);
        console.log(`✅ Post-category relationships seeder completed successfully (${postCategoryRelations.length} relationships created)`);
    } else {
        console.log('⚠️ No relationships created - check if posts and categories exist');
    }
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});