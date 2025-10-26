'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PenSquare, Home, LayoutDashboard, LogOut, User } from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    
    if (error?.code) {
      toast.error('Failed to sign out. Please try again.');
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success('Signed out successfully');
      router.push('/');
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <PenSquare className="h-6 w-6" />
              <span className="font-bold text-xl">Blog</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/blog"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/blog' ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                Blog
              </Link>
              {session?.user && (
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith('/dashboard') ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isPending && session?.user ? (
              <>
                <Link href="/dashboard/posts/new">
                  <Button size="sm" className="hidden sm:flex">
                    <PenSquare className="mr-2 h-4 w-4" />
                    New Post
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{session.user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : !isPending ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}