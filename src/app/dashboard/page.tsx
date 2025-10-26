'use client';

import { trpc } from '@/lib/trpc/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { PenSquare, Trash2, Eye, Plus, FileText, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const utils = trpc.useUtils();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login?redirect=' + encodeURIComponent('/dashboard'));
    }
  }, [session, isPending, router]);

  const { data: allPosts, isLoading: postsLoading } = trpc.posts.getAll.useQuery({});
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success('Post deleted successfully');
      utils.posts.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deletePost.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </>
    );
  }

  // Don't render dashboard content if not authenticated
  if (!session?.user) {
    return null;
  }

  const publishedPosts = allPosts?.filter(p => p.published) || [];
  const draftPosts = allPosts?.filter(p => !p.published) || [];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Manage your blog posts and categories</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/categories">
                <Button variant="outline">
                  <Tag className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/dashboard/posts/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {postsLoading ? <Skeleton className="h-8 w-16" /> : allPosts?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {publishedPosts.length} published, {draftPosts.length} drafts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {postsLoading ? <Skeleton className="h-8 w-16" /> : publishedPosts.length}
                </div>
                <p className="text-xs text-muted-foreground">Live on your blog</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categoriesLoading ? <Skeleton className="h-8 w-16" /> : categories?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Posts Tables */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Posts ({allPosts?.length || 0})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Posts</CardTitle>
                  <CardDescription>Manage all your blog posts</CardDescription>
                </CardHeader>
                <CardContent>
                  {postsLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : allPosts && allPosts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Categories</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">
                              <Link href={`/blog/${post.slug}`} className="hover:underline">
                                {post.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant={post.published ? 'default' : 'secondary'}>
                                {post.published ? 'Published' : 'Draft'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {post.categories.slice(0, 2).map((cat) => (
                                  <Badge key={cat.id} variant="outline" className="text-xs">
                                    {cat.name}
                                  </Badge>
                                ))}
                                {post.categories.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.categories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/blog/${post.slug}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">No posts yet</p>
                      <Link href="/dashboard/posts/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Post
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="published">
              <Card>
                <CardHeader>
                  <CardTitle>Published Posts</CardTitle>
                  <CardDescription>Posts visible on your blog</CardDescription>
                </CardHeader>
                <CardContent>
                  {postsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : publishedPosts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Categories</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {publishedPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">
                              <Link href={`/blog/${post.slug}`} className="hover:underline">
                                {post.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {post.categories.slice(0, 2).map((cat) => (
                                  <Badge key={cat.id} variant="outline" className="text-xs">
                                    {cat.name}
                                  </Badge>
                                ))}
                                {post.categories.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.categories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/blog/${post.slug}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No published posts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drafts">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Posts</CardTitle>
                  <CardDescription>Posts not yet published</CardDescription>
                </CardHeader>
                <CardContent>
                  {postsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : draftPosts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Categories</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {draftPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {post.categories.slice(0, 2).map((cat) => (
                                  <Badge key={cat.id} variant="outline" className="text-xs">
                                    {cat.name}
                                  </Badge>
                                ))}
                                {post.categories.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.categories.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(post.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <PenSquare className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteId(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No draft posts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}