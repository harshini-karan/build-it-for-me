'use client';

import { trpc } from '@/lib/trpc/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  const { data: posts, isLoading: postsLoading } = trpc.posts.getAll.useQuery({
    published: true,
    categoryId: selectedCategoryId || undefined,
  });

  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Posts</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our collection of articles on web development, technology, and best practices
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategoryId === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategoryId(null)}
              >
                All Posts
              </Button>
              {categoriesLoading ? (
                <>
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </>
              ) : (
                categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2">
                      {category.postCount}
                    </Badge>
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postsLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatDate(post.createdAt)}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No posts found{selectedCategoryId ? ' in this category' : ''}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
