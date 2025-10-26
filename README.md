# BlogHub - Modern Full-Stack Blogging Platform

A powerful, full-stack blogging platform built with Next.js 15, tRPC, Drizzle ORM, and modern web technologies. Features type-safe APIs, rich content editing with Markdown support, category management, and a clean, responsive UI.

## 🚀 Features

### ✅ Core Features (Must Have - Priority 1)
- ✅ **Blog Post CRUD Operations** - Create, read, update, and delete blog posts
- ✅ **Category CRUD Operations** - Full category management system
- ✅ **Post-Category Relationships** - Assign multiple categories to posts
- ✅ **Blog Listing Page** - View all published posts with filtering
- ✅ **Individual Post View** - Read full blog posts with formatted content
- ✅ **Category Filtering** - Filter posts by category on the blog page
- ✅ **Responsive Navigation** - Clean navigation across all pages
- ✅ **Professional UI** - Clean, modern design using Shadcn/UI

### ✅ Expected Features (Should Have - Priority 2)
- ✅ **Landing Page** - Complete landing page with Header, Hero, Features, CTA, and Footer sections
- ✅ **Dashboard** - Comprehensive dashboard for managing posts
- ✅ **Draft vs Published Status** - Save drafts and publish when ready
- ✅ **Loading & Error States** - Proper loading skeletons and error handling
- ✅ **Mobile-Responsive Design** - Fully responsive across all devices
- ✅ **Markdown Editor** - Rich content editor with Markdown support and live preview

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 15 (App Router)
- **Database:** SQLite with Turso (configured, PostgreSQL-compatible structure)
- **ORM:** Drizzle ORM
- **API Layer:** tRPC for type-safe APIs
- **Validation:** Zod schemas
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query via tRPC)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **Content Editor:** Markdown with react-markdown and remark-gfm

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd bloghub
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Variables
The database is already configured with Turso (SQLite). The `.env` file contains:
```env
TURSO_CONNECTION_URL=<provided>
TURSO_AUTH_TOKEN=<provided>
```

### 4. Run Database Migrations
The database schema is already set up. If you need to recreate it:
```bash
npm run db:push
```

### 5. Seed the Database (Optional)
Seed the database with sample posts and categories:
```bash
npm run db:seed
```

Or run individual seeders:
```bash
# Seed categories
bun run src/db/seeds/categories.ts

# Seed posts
bun run src/db/seeds/posts.ts

# Seed post-category relationships
bun run src/db/seeds/postCategories.ts
```

### 6. Run Development Server
```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/trpc/            # tRPC API endpoint
│   │   ├── blog/                # Blog listing and post pages
│   │   ├── dashboard/           # Dashboard and post management
│   │   │   ├── categories/      # Category management
│   │   │   └── posts/           # Post editor (new/edit)
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles + prose styles
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn/UI components
│   │   ├── Navigation.tsx       # Site navigation
│   │   ├── PostEditor.tsx       # Markdown post editor
│   │   └── Toaster.tsx          # Toast notifications
│   ├── db/                      # Database configuration
│   │   ├── seeds/               # Database seeders
│   │   ├── schema.ts            # Drizzle schema definitions
│   │   └── index.ts             # Database client
│   ├── lib/                     # Utilities and helpers
│   │   ├── trpc/               # tRPC client setup
│   │   │   ├── client.ts       # tRPC client
│   │   │   └── react.tsx       # tRPC React provider
│   │   └── store/              # Zustand stores
│   │       └── blogStore.ts    # Blog state management
│   └── server/                  # Server-side code
│       ├── routers/            # tRPC routers
│       │   ├── posts.ts        # Posts CRUD operations
│       │   ├── categories.ts   # Categories CRUD operations
│       │   └── _app.ts         # Root router
│       └── trpc.ts             # tRPC initialization
├── drizzle.config.ts           # Drizzle ORM configuration
└── package.json                # Dependencies and scripts
```

## 🗄️ Database Schema

### Tables

#### `posts`
- `id` - Integer, Primary Key, Auto-increment
- `title` - Text, Not Null
- `slug` - Text, Unique, Not Null
- `content` - Text, Not Null (Markdown)
- `excerpt` - Text, Nullable
- `published` - Boolean, Default: false
- `createdAt` - Timestamp, Not Null
- `updatedAt` - Timestamp, Not Null

#### `categories`
- `id` - Integer, Primary Key, Auto-increment
- `name` - Text, Not Null
- `slug` - Text, Unique, Not Null
- `description` - Text, Nullable
- `createdAt` - Timestamp, Not Null

#### `post_categories` (Junction Table)
- `postId` - Integer, Foreign Key to `posts.id` (Cascade Delete)
- `categoryId` - Integer, Foreign Key to `categories.id` (Cascade Delete)
- Primary Key: (`postId`, `categoryId`)

## 🔌 API Endpoints (tRPC)

### Posts Router (`trpc.posts`)

#### Queries
- `getAll({ published?, categoryId? })` - Get all posts with optional filters
- `getBySlug({ slug })` - Get single post by slug
- `getById({ id })` - Get single post by ID

#### Mutations
- `create({ title, content, excerpt?, published, categoryIds? })` - Create new post
- `update({ id, title?, content?, excerpt?, published?, categoryIds? })` - Update post
- `delete({ id })` - Delete post

### Categories Router (`trpc.categories`)

#### Queries
- `getAll()` - Get all categories with post counts
- `getById({ id })` - Get single category by ID
- `getBySlug({ slug })` - Get single category by slug

#### Mutations
- `create({ name, description? })` - Create new category
- `update({ id, name?, description? })` - Update category
- `delete({ id })` - Delete category (fails if assigned to posts)

## 🎨 Key Features Explained

### Type-Safe APIs with tRPC
All API calls are fully type-safe from client to server. TypeScript automatically infers types, eliminating the need for manual type definitions or code generation.

```typescript
// Automatic type inference and autocomplete
const { data: posts } = trpc.posts.getAll.useQuery({ published: true });
//    ^? Post[]
```

### Markdown Content Editor
Write posts using Markdown with real-time preview. Supports:
- Headings, lists, links, images
- Code blocks with syntax highlighting
- Tables, blockquotes
- GitHub Flavored Markdown (GFM)

### Slug Generation
Automatic URL-friendly slug generation from post/category titles with conflict detection.

### Category Management
- Create, edit, delete categories
- Assign multiple categories to posts
- Filter posts by category
- Prevent deletion of categories in use

### Draft System
Save posts as drafts and publish when ready. Drafts are hidden from the public blog.

## 🎯 Architecture Decisions

### Why tRPC?
- **End-to-end type safety** without code generation
- **Automatic type inference** for all API calls
- **Integrated with React Query** for caching and state management
- **Simple API definition** with minimal boilerplate

### Why Drizzle ORM?
- **Type-safe SQL queries** with TypeScript
- **Lightweight and fast** compared to other ORMs
- **SQL-like syntax** that's familiar and powerful
- **Excellent TypeScript support**

### Why Markdown?
- **Faster to implement** than rich text editors (2-3 hours saved)
- **Clean, portable content** format
- **Version control friendly**
- **Widely supported** and understood

### Why Zustand?
- **Simpler than Redux** for global state
- **Minimal boilerplate** and easy to use
- **Great TypeScript support**
- **Perfect for client-side state** (category filters, etc.)

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with CTA buttons
- Features showcase
- Stats display
- Call-to-action section
- Footer with navigation

### Blog Listing (`/blog`)
- List of published posts
- Category filter buttons
- Post cards with excerpts
- Mobile responsive grid

### Individual Post (`/blog/[slug]`)
- Full post content with Markdown rendering
- Category badges
- Reading time estimate
- Navigation back to blog

### Dashboard (`/dashboard`)
- Post statistics
- All posts, published posts, and drafts tabs
- Quick actions (view, edit, delete)
- Post management table

### Post Editor (`/dashboard/posts/new` & `/dashboard/posts/[id]/edit`)
- Markdown editor with live preview
- Category selection
- Draft/publish toggle
- Auto-save excerpt generation

### Category Management (`/dashboard/categories`)
- Category cards with post counts
- Create, edit, delete categories
- Protection against deleting categories in use

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `TURSO_CONNECTION_URL`
   - `TURSO_AUTH_TOKEN`
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with Docker

## 🧪 Testing the Application

### Test the Blog
1. Visit `/blog` to see published posts
2. Click on categories to filter posts
3. Click on a post to read it

### Test the Dashboard
1. Visit `/dashboard` to see all posts
2. Use tabs to filter by status (All, Published, Drafts)
3. Click edit icon to modify posts
4. Click delete icon to remove posts

### Test Post Creation
1. Visit `/dashboard/posts/new`
2. Enter title and content (use Markdown)
3. Select categories
4. Toggle published status
5. Save the post

### Test Category Management
1. Visit `/dashboard/categories`
2. Create new categories
3. Edit existing categories
4. Try to delete a category in use (should fail)

## 📊 Sample Data

The database is seeded with:
- **8 blog posts** (5 published, 3 drafts)
- **5 categories** (Technology, Web Development, Tutorial, Best Practices, News)
- **21 post-category relationships**

Posts include realistic content about:
- Next.js 15
- Building Scalable Applications
- TypeScript Best Practices
- Understanding tRPC
- Modern React Patterns
- Database Design Principles
- API Security Best Practices
- Serverless Architecture

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This is an assessment project, but feel free to use it as a template for your own projects!

## 📝 License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ using Next.js 15, tRPC, Drizzle ORM, and modern web technologies.**