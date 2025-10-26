'use client';

import { trpc } from '@/lib/trpc/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: post, isLoading, error } = trpc.posts.getBySlug.useQuery({ slug });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          {isLoading ? (
            <article className="max-w-4xl mx-auto">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-96 w-full" />
            </article>
          ) : error ? (
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <Button>Return to Blog</Button>
              </Link>
            </div>
          ) : post ? (
            <article className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="text-sm">
                      {category.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {estimateReadingTime(post.content)} min read
                  </div>
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Footer */}
              <footer className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  {post.categories.map((category) => (
                    <Link key={category.id} href={`/blog?category=${category.slug}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <Link href="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Posts
                  </Button>
                </Link>
              </footer>
            </article>
          ) : null}
        </div>
      </div>
    </>
  );
}
