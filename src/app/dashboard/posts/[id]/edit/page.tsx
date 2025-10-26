'use client';

import Navigation from '@/components/Navigation';
import PostEditor from '@/components/PostEditor';
import { use } from 'react';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = parseInt(id);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PostEditor postId={postId} />
        </div>
      </div>
    </>
  );
}
