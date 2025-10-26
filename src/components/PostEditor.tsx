'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Eye, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface PostEditorProps {
  postId?: number;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { data: post, isLoading: postLoading } = trpc.posts.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  const { data: categories } = trpc.categories.getAll.useQuery();

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      toast.success('Post created successfully');
      utils.posts.getAll.invalidate();
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updatePost = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success('Post updated successfully');
      utils.posts.getAll.invalidate();
      utils.posts.getById.invalidate({ id: postId! });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt || '');
      setPublished(post.published);
      setSelectedCategories(post.categories.map(c => c.id));
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const postData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      published,
      categoryIds: selectedCategories,
    };

    if (postId) {
      updatePost.mutate({ id: postId, ...postData });
    } else {
      createPost.mutate(postData);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isLoading = createPost.isPending || updatePost.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{postId ? 'Edit Post' : 'Create New Post'}</h1>
          <p className="text-muted-foreground">
            {postId ? 'Update your blog post' : 'Write and publish a new blog post'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Post
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Enter the basic information for your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post (optional)"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty to use the first 200 characters of content
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
              <CardDescription>Write your post content using Markdown</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="mt-4">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here using Markdown..."
                    rows={20}
                    className="font-mono"
                    required
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <div className="prose dark:prose-invert max-w-none border rounded-md p-4 min-h-[500px]">
                    {content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground">Nothing to preview yet...</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Select categories for your post</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      {selectedCategories.includes(category.id) && (
                        <Badge variant="secondary">Selected</Badge>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm mt-1 opacity-80">{category.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Markdown Guide</CardTitle>
              <CardDescription>Quick reference for Markdown syntax</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <code className="bg-muted px-2 py-1 rounded"># Heading 1</code>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">## Heading 2</code>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">**bold text**</code>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">*italic text*</code>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">[Link](url)</code>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">- List item</code>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">`code`</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}