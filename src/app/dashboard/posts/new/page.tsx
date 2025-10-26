'use client';

import Navigation from '@/components/Navigation';
import PostEditor from '@/components/PostEditor';

export default function NewPostPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PostEditor />
        </div>
      </div>
    </>
  );
}
