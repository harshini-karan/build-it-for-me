'use client';

import { trpc } from '@/lib/trpc/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus, PenSquare, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const utils = trpc.useUtils();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string; description?: string | null } | null>(null);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const { data: categories, isLoading } = trpc.categories.getAll.useQuery();

  const createCategory = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully');
      utils.categories.getAll.invalidate();
      setIsCreateOpen(false);
      setNewName('');
      setNewDescription('');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateCategory = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success('Category updated successfully');
      utils.categories.getAll.invalidate();
      setIsEditOpen(false);
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteCategory = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success('Category deleted successfully');
      utils.categories.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error('Category name is required');
      return;
    }

    createCategory.mutate({
      name: newName,
      description: newDescription || undefined,
    });
  };

  const handleEdit = (category: { id: number; name: string; description?: string | null }) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingCategory || !editName.trim()) {
      toast.error('Category name is required');
      return;
    }

    updateCategory.mutate({
      id: editingCategory.id,
      name: editName,
      description: editDescription || undefined,
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCategory.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/dashboard">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-4xl font-bold mb-2">Categories</h1>
              <p className="text-muted-foreground">Manage your blog categories</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </>
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Tag className="h-5 w-5" />
                          {category.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {category.description || 'No description'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <PenSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(category.id)}
                          disabled={category.postCount > 0}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No categories yet</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Category
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your blog posts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createCategory.isPending}>
              {createCategory.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateCategory.isPending}>
              {updateCategory.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
              {categories?.find(c => c.id === deleteId)?.postCount! > 0 && (
                <span className="block mt-2 text-destructive font-semibold">
                  This category cannot be deleted because it's assigned to posts.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}