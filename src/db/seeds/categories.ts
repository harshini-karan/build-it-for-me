import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Technology',
            slug: 'technology',
            description: 'Latest trends and innovations in technology',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Web Development',
            slug: 'web-development',
            description: 'Modern web development techniques and frameworks',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Tutorial',
            slug: 'tutorial',
            description: 'Step-by-step guides and learning resources',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Best Practices',
            slug: 'best-practices',
            description: 'Industry standards and recommended approaches',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'News',
            slug: 'news',
            description: 'Latest updates and announcements',
            createdAt: new Date().toISOString(),
        }
    ];

    const insertedCategories = await db.insert(categories).values(sampleCategories).returning();
    
    console.log('✅ Categories seeder completed successfully');
    console.log(`📊 Inserted ${insertedCategories.length} categories`);
    
    return insertedCategories;
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});