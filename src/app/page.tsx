'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { ArrowRight, PenSquare, BookOpen, Zap, Shield, Layers, Github } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 pt-20 pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Write, Publish, Share Your Stories
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                A powerful blogging platform for sharing your ideas with the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/blog">
                  <Button size="lg" className="text-lg px-8">
                    Explore Blog
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/posts/new">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <PenSquare className="mr-2 h-5 w-5" />
                    Start Writing
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Fast</div>
                <p className="text-muted-foreground">Blazing performance for the best experience</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Secure</div>
                <p className="text-muted-foreground">Your content is safe and protected</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Simple</div>
                <p className="text-muted-foreground">Easy to use with an intuitive interface</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create and manage your content
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <PenSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Rich Content Editor</CardTitle>
                  <CardDescription>
                    Write beautiful posts with Markdown support. Preview in real-time as you write.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Category Management</CardTitle>
                  <CardDescription>
                    Organize posts with categories. Filter and discover content easily.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Draft & Publish</CardTitle>
                  <CardDescription>
                    Save drafts and publish when ready. Full control over your content lifecycle.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Optimized performance for a smooth and responsive experience.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Secure Platform</CardTitle>
                  <CardDescription>
                    Your data is protected with industry-standard security practices.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Github className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Modern Technology</CardTitle>
                  <CardDescription>
                    Built with the latest web technologies for the best experience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="p-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Start Writing?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Share your knowledge and ideas with the world.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard/posts/new">
                      <Button size="lg">
                        <PenSquare className="mr-2 h-5 w-5" />
                        Create Your First Post
                      </Button>
                    </Link>
                    <Link href="/blog">
                      <Button size="lg" variant="outline">
                        Browse Posts
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/50 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <PenSquare className="h-6 w-6" />
                  <span className="font-bold text-xl">Blog</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  A modern blogging platform for sharing your stories and ideas with the world.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Navigation</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-foreground transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/categories" className="hover:text-foreground transition-colors">
                      Categories
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/dashboard/posts/new" className="hover:text-foreground transition-colors">
                      Create Post
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
              <p>© 2024 All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}