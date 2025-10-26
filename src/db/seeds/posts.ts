import { db } from '@/db';
import { posts } from '@/db/schema';

async function main() {
    const samplePosts = [
        {
            title: 'Getting Started with Next.js 15',
            slug: 'getting-started-with-nextjs-15',
            excerpt: 'Learn the fundamentals of Next.js 15 and discover the new features that make it the best React framework for production.',
            content: `Next.js 15 represents a significant leap forward in React-based web development, introducing powerful features that enhance both developer experience and application performance. This comprehensive guide will walk you through everything you need to know to get started with Next.js 15.

## The App Router Revolution

The App Router, first introduced in Next.js 13 and now matured in version 15, fundamentally changes how we think about routing in Next.js applications. Built on React Server Components, it enables unprecedented flexibility in data fetching and rendering strategies.

\`\`\`typescript
// app/page.tsx
export default async function HomePage() {
  const data = await fetch('https://api.example.com/posts');
  const posts = await data.json();
  
  return (
    <div>
      <h1>Welcome to Next.js 15</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

## Server Components by Default

One of the most impactful changes in Next.js 15 is that all components are Server Components by default. This means your components run on the server, reducing the JavaScript bundle sent to the client and improving initial page load times dramatically.

## Improved Performance and Streaming

Next.js 15 introduces enhanced streaming capabilities, allowing parts of your page to load incrementally. This creates a better user experience, especially for content-heavy applications. The Suspense API integrates seamlessly with the App Router, enabling granular loading states.

\`\`\`typescript
import { Suspense } from 'react';
import PostList from './components/PostList';
import LoadingSkeleton from './components/LoadingSkeleton';

export default function BlogPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PostList />
    </Suspense>
  );
}
\`\`\`

## Deployment and Production Ready

Deploying Next.js 15 applications is straightforward with Vercel, but the framework also supports various hosting options including Docker, standalone mode, and traditional Node.js servers. The build process is optimized for production with automatic code splitting, image optimization, and font optimization built-in.

Next.js 15 is the most powerful version yet, combining ease of use with enterprise-grade performance and scalability.`,
            published: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            title: 'Building Scalable Applications',
            slug: 'building-scalable-applications',
            excerpt: 'Explore architectural patterns and best practices for building applications that can handle millions of users.',
            content: `Building applications that scale from hundreds to millions of users requires careful planning, the right architectural decisions, and a deep understanding of performance optimization. This guide explores the essential patterns and practices that enable true scalability.

## Understanding Scalability Fundamentals

Scalability isn't just about handling more users—it's about maintaining performance, reliability, and cost-effectiveness as your application grows. There are two primary types of scaling: vertical (adding more power to existing machines) and horizontal (adding more machines).

## Database Optimization Strategies

Your database is often the first bottleneck in a scaling application. Start with proper indexing on frequently queried columns, use database connection pooling to manage connections efficiently, and consider read replicas for read-heavy workloads.

\`\`\`typescript
// Example of connection pooling configuration
const pool = new Pool({
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

## Implementing Effective Caching

Caching is crucial for scalability. Implement multiple layers: browser caching for static assets, CDN caching for global content delivery, application-level caching with Redis or Memcached for frequently accessed data, and database query caching.

A well-designed caching strategy can reduce database load by 80-90% in many applications. Remember to implement cache invalidation strategies to ensure data consistency.

## Load Balancing and Distribution

As traffic grows, distribute it across multiple servers using load balancers. Modern load balancers like NGINX or cloud-based solutions like AWS ALB can distribute traffic based on various algorithms—round-robin, least connections, or IP hash.

\`\`\`nginx
upstream backend {
  least_conn;
  server backend1.example.com;
  server backend2.example.com;
  server backend3.example.com;
}
\`\`\`

## Microservices Architecture

Breaking your monolith into microservices allows independent scaling of different application components. Payment processing might need different scaling characteristics than user authentication or content delivery.

## Monitoring and Observability

You can't scale what you can't measure. Implement comprehensive monitoring with tools like Prometheus, Grafana, or DataDog. Track key metrics: response times, error rates, database query performance, and resource utilization. Set up alerts for anomalies before they become critical issues.

Scalability is a journey, not a destination. Start with solid fundamentals and evolve your architecture as your needs grow.`,
            published: true,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            title: 'TypeScript Best Practices',
            slug: 'typescript-best-practices',
            excerpt: 'Master TypeScript with these essential tips and patterns that will make your code more maintainable and type-safe.',
            content: `TypeScript has transformed JavaScript development by adding static typing, but using it effectively requires understanding its advanced features and best practices. This guide covers essential patterns that will elevate your TypeScript code.

## Leverage Type Inference

TypeScript's type inference is powerful—use it. Don't explicitly type everything when TypeScript can infer types automatically. This keeps your code cleaner and more maintainable.

\`\`\`typescript
// Good - type is inferred
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};

// Unnecessary - explicit typing when inference works
const user: { name: string; email: string; age: number } = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};
\`\`\`

## Master Generics for Reusability

Generics enable you to write flexible, reusable functions and components that work with multiple types while maintaining type safety.

\`\`\`typescript
function getFirstElement<T>(array: T[]): T | undefined {
  return array[0];
}

const firstNumber = getFirstElement([1, 2, 3]); // type: number | undefined
const firstString = getFirstElement(['a', 'b', 'c']); // type: string | undefined
\`\`\`

## Utility Types Are Your Friends

TypeScript provides built-in utility types that solve common type manipulation needs: Partial, Required, Readonly, Pick, Omit, Record, and more.

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

type UserUpdate = Partial<User>; // All properties optional
type PublicUser = Omit<User, 'email'>; // User without email
type ReadonlyUser = Readonly<User>; // All properties readonly
\`\`\`

## Enable Strict Mode

Always use strict mode in your tsconfig.json. It catches common errors and enforces best practices. Start new projects with strict mode enabled from day one.

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
\`\`\`

## Avoid Common Pitfalls

Don't use 'any' type unless absolutely necessary—it defeats the purpose of TypeScript. Instead, use 'unknown' for truly unknown types and narrow them with type guards. Avoid type assertions (as Type) when possible; prefer type guards and proper typing.

## Discriminated Unions for Complex States

Use discriminated unions to represent complex state with mutually exclusive properties. This pattern is especially useful for handling different response types or UI states.

\`\`\`typescript
type ApiResponse<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return response.data; // TypeScript knows data exists here
    case 'error':
      return response.error; // TypeScript knows error exists here
  }
}
\`\`\`

TypeScript is a powerful tool that, when used correctly, makes your code more maintainable, catches bugs early, and improves the development experience for your entire team.`,
            published: false,
            createdAt: new Date('2024-01-25').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        {
            title: 'Understanding tRPC',
            slug: 'understanding-trpc',
            excerpt: 'Discover how tRPC brings end-to-end type safety to your API layer without code generation.',
            content: `tRPC revolutionizes API development by providing end-to-end type safety between your server and client without any code generation. If you're using TypeScript for both frontend and backend, tRPC is a game-changer that eliminates an entire class of bugs.

## What Makes tRPC Special

Traditional API development requires maintaining separate type definitions for your frontend and backend, or using code generation tools like GraphQL codegen. tRPC takes a different approach—it leverages TypeScript's type inference to automatically share types between your client and server.

## Setting Up tRPC

Getting started with tRPC is straightforward. First, install the necessary packages and create your tRPC router on the server.

\`\`\`typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
\`\`\`

## Creating Your First Router

Routers in tRPC define your API endpoints. Each procedure can handle queries (read operations) or mutations (write operations).

\`\`\`typescript
// server/routers/posts.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const postsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.posts.findMany();
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.posts.findUnique({
        where: { id: input.id }
      });
    }),
  
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await db.posts.create({
        data: input
      });
    }),
});
\`\`\`

## Client Usage and Type Safety

On the client side, you get full autocomplete and type checking for all your API calls. No need to manually define response types—they're automatically inferred from your server.

\`\`\`typescript
// client/App.tsx
import { trpc } from './trpc';

function BlogPost({ id }: { id: string }) {
  const { data, isLoading } = trpc.posts.getById.useQuery({ id });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <article>
      <h1>{data?.title}</h1>
      <p>{data?.content}</p>
    </article>
  );
}
\`\`\`

## Middleware and Context

tRPC supports middleware for cross-cutting concerns like authentication, logging, and request validation. Context allows you to pass data like the current user to all procedures.

\`\`\`typescript
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(authMiddleware);
\`\`\`

## Error Handling

tRPC provides type-safe error handling. You can define custom error types and handle them appropriately on the client.

## Integration with React Query

tRPC works seamlessly with React Query, giving you powerful caching, refetching, and state management capabilities out of the box.

tRPC eliminates the complexity of maintaining API contracts between your frontend and backend, making full-stack TypeScript development truly seamless.`,
            published: true,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            title: 'Modern React Patterns',
            slug: 'modern-react-patterns',
            excerpt: 'Stay up-to-date with the latest React patterns including hooks, composition, and state management strategies.',
            content: `React has evolved significantly since its introduction, and staying current with modern patterns is essential for building maintainable, performant applications. This guide explores the patterns that define modern React development.

## Custom Hooks for Reusability

Custom hooks are the cornerstone of modern React patterns. They enable you to extract component logic into reusable functions while maintaining access to React's features.

\`\`\`typescript
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
\`\`\`

## Compound Components Pattern

Compound components provide an elegant way to build flexible, composable UI elements. This pattern is especially powerful for component libraries.

\`\`\`typescript
function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="tabs-list">{children}</div>;
};

Tabs.Tab = function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      onClick={() => setActiveTab(index)}
      className={activeTab === index ? 'active' : ''}
    >
      {children}
    </button>
  );
};
\`\`\`

## The Evolution of Render Props

While render props were once the primary pattern for sharing logic, hooks have largely superseded them. However, understanding this evolution helps you appreciate the power of hooks and recognize when render props might still be appropriate.

## Context Usage Best Practices

Context is powerful but should be used judiciously. Create separate contexts for different concerns rather than one massive context. This prevents unnecessary re-renders and makes your code more maintainable.

\`\`\`typescript
// Separate contexts for different concerns
const ThemeContext = createContext<Theme>(defaultTheme);
const AuthContext = createContext<AuthState>(defaultAuth);
const NotificationContext = createContext<NotificationAPI>(defaultNotifications);
\`\`\`

## Performance Optimization Patterns

Modern React provides several tools for optimization. Use React.memo for expensive components that don't need frequent re-renders, useMemo for expensive calculations, and useCallback for stable function references.

\`\`\`typescript
const MemoizedExpensiveComponent = React.memo(function ExpensiveComponent({ data }: Props) {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);
  
  return <div onClick={handleClick}>{processedData}</div>;
});
\`\`\`

## Server Components and Suspense

React Server Components represent the future of React, enabling you to render components on the server while maintaining interactivity. Combined with Suspense, they enable sophisticated loading states and streaming.

## State Management Evolution

Modern state management has moved beyond Redux for many use cases. Consider local state first, then context, then state management libraries only when needed. Tools like Zustand and Jotai provide simpler alternatives to Redux for global state.

Understanding and applying these modern patterns will make your React applications more maintainable, performant, and aligned with the ecosystem's direction.`,
            published: true,
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        },
        {
            title: 'Database Design Principles',
            slug: 'database-design-principles',
            excerpt: 'Learn fundamental database design principles that will help you create efficient and maintainable data models.',
            content: `Effective database design is foundational to building scalable, maintainable applications. Poor database design leads to performance issues, data inconsistencies, and maintenance nightmares. This guide covers the essential principles for creating robust database schemas.

## Normalization Fundamentals

Normalization is the process of organizing data to minimize redundancy and dependency. The goal is to store each piece of information only once and establish clear relationships between data.

First Normal Form (1NF) requires that each column contains atomic values—no lists or arrays in a single field. Second Normal Form (2NF) ensures that all non-key attributes depend on the entire primary key. Third Normal Form (3NF) eliminates transitive dependencies where non-key attributes depend on other non-key attributes.

\`\`\`sql
-- Bad: Denormalized design
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  customer_email VARCHAR(100),
  product_names TEXT, -- Comma-separated list
  total DECIMAL(10,2)
);

-- Good: Normalized design
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  total DECIMAL(10,2)
);

CREATE TABLE order_items (
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT,
  price DECIMAL(10,2)
);
\`\`\`

## Indexing Strategies

Indexes dramatically improve query performance but come with tradeoffs. They speed up reads but slow down writes and consume storage. Index columns used in WHERE clauses, JOIN conditions, and ORDER BY statements.

Create composite indexes for queries that filter on multiple columns. The order of columns in composite indexes matters—put the most selective column first.

\`\`\`sql
-- Index for common query patterns
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
CREATE INDEX idx_products_category ON products(category_id, price);
\`\`\`

## Relationship Design

Choose the right relationship type: one-to-one for optional attributes or separate concerns, one-to-many for hierarchical data, and many-to-many through junction tables.

\`\`\`sql
-- Many-to-many relationship with junction table
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id INT PRIMARY KEY,
  title VARCHAR(200)
);

CREATE TABLE enrollments (
  student_id INT REFERENCES students(id),
  course_id INT REFERENCES courses(id),
  enrolled_at TIMESTAMP,
  PRIMARY KEY (student_id, course_id)
);
\`\`\`

## Query Optimization Principles

Design your schema with query patterns in mind. Denormalization might be appropriate for read-heavy tables where joins become too expensive. Consider materialized views for complex aggregations.

Use EXPLAIN to analyze query execution plans and identify bottlenecks. Avoid SELECT * and retrieve only the columns you need. Be cautious with N+1 queries—fetch related data in a single query when possible.

## Common Anti-Patterns to Avoid

Never use BLOB columns for frequently accessed data—store file paths instead. Avoid EAV (Entity-Attribute-Value) patterns unless you truly need dynamic schemas. Don't use varchar columns for numeric data. Prevent circular references in your relationships.

Store timestamps in UTC and convert to local time in the application layer. Use appropriate data types—don't use VARCHAR for everything. Implement soft deletes when you need audit trails.

## Data Integrity and Constraints

Use foreign key constraints to maintain referential integrity. Add CHECK constraints for business rules that can be enforced at the database level. Use NOT NULL appropriately and set sensible defaults.

Good database design is about finding the right balance between normalization, performance, and maintainability for your specific use case.`,
            published: false,
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            title: 'API Security Best Practices',
            slug: 'api-security-best-practices',
            excerpt: 'Protect your APIs with these essential security practices and authentication strategies.',
            content: `API security is critical in modern web applications. A single vulnerability can expose sensitive data or allow unauthorized access to your entire system. This comprehensive guide covers essential security practices for protecting your APIs.

## Authentication Methods

Choose the right authentication method for your use case. JWT (JSON Web Tokens) are popular for stateless authentication, OAuth 2.0 for third-party integrations, and API keys for server-to-server communication.

\`\`\`typescript
// JWT authentication middleware
async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
\`\`\`

## Authorization Patterns

Authentication verifies who you are; authorization determines what you can do. Implement role-based access control (RBAC) or attribute-based access control (ABAC) depending on your needs.

\`\`\`typescript
function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.delete('/api/users/:id', authenticateJWT, requireRole('admin'), deleteUser);
\`\`\`

## Rate Limiting

Implement rate limiting to prevent abuse and DDoS attacks. Use sliding window algorithms for more accurate limiting, and consider different limits for different endpoints.

\`\`\`typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});

app.use('/api/', limiter);
\`\`\`

## Input Validation and Sanitization

Never trust user input. Validate all incoming data using schemas (Zod, Yup, Joi) and sanitize to prevent injection attacks. Use parameterized queries for database operations.

\`\`\`typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(50),
});

app.post('/api/users', async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    // Proceed with validated data
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' });
  }
});
\`\`\`

## CORS Configuration

Configure CORS (Cross-Origin Resource Sharing) properly to prevent unauthorized domains from accessing your API. Be specific about allowed origins—avoid using wildcards in production.

\`\`\`typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://app.yourdomain.com']
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
\`\`\`

## Common Vulnerabilities

Protect against SQL injection by using parameterized queries. Prevent XSS (Cross-Site Scripting) by sanitizing output and using Content Security Policy headers. Guard against CSRF (Cross-Site Request Forgery) with tokens or SameSite cookies.

Always use HTTPS in production. Never expose sensitive information in error messages. Implement proper logging and monitoring to detect security incidents.

## Security Headers

Set appropriate security headers to protect against common attacks.

\`\`\`typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
\`\`\`

Security is not a one-time task but an ongoing process. Regularly update dependencies, conduct security audits, and stay informed about new vulnerabilities and best practices.`,
            published: true,
            createdAt: new Date('2024-02-15').toISOString(),
            updatedAt: new Date('2024-02-15').toISOString(),
        },
        {
            title: 'Serverless Architecture Guide',
            slug: 'serverless-architecture-guide',
            excerpt: 'Understand when and how to use serverless architecture for building modern cloud applications.',
            content: `Serverless architecture has transformed how we build and deploy applications, offering automatic scaling, reduced operational overhead, and pay-per-use pricing. This guide helps you understand when serverless makes sense and how to implement it effectively.

## Understanding Serverless

Serverless doesn't mean no servers—it means you don't manage servers. Cloud providers handle infrastructure, scaling, and maintenance while you focus on code. Functions-as-a-Service (FaaS) like AWS Lambda, Google Cloud Functions, and Azure Functions are the core of serverless architecture.

## Function Design Principles

Design functions to be small, focused, and stateless. Each function should do one thing well. Keep functions lightweight to minimize cold start times.

\`\`\`typescript
// Good: Focused function
export async function handler(event: APIGatewayEvent) {
  const userId = event.pathParameters?.id;
  
  const user = await db.users.findUnique({
    where: { id: userId }
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(user)
  };
}
\`\`\`

Avoid heavy dependencies that increase package size and cold start time. Use environment variables for configuration. Implement proper error handling and logging.

## Cold Start Considerations

Cold starts occur when a function is invoked after being idle. They add latency to your application. Minimize cold starts by keeping packages small, using provisioned concurrency for critical functions, and keeping functions warm with scheduled pings if necessary.

\`\`\`typescript
// Optimize imports to reduce cold starts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'; // Specific import
// NOT: import * as AWS from 'aws-sdk'; // Imports everything
\`\`\`

## Pricing Considerations

Serverless pricing is based on execution time and resources used. This can be extremely cost-effective for applications with variable load but expensive for constant high-traffic applications.

Calculate your expected invocations, average execution time, and memory requirements. Compare costs with traditional hosting. For steady, predictable traffic, containers might be more cost-effective.

## Vendor Options and Tradeoffs

AWS Lambda is the most mature with the largest ecosystem. Google Cloud Functions offers good Node.js performance and integrates well with GCP services. Azure Functions integrates seamlessly with Microsoft's ecosystem. Cloudflare Workers use V8 isolates for incredibly fast cold starts.

\`\`\`typescript
// Cloudflare Worker example
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/hello') {
      return new Response('Hello from the edge!', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
}
\`\`\`

## Deployment Strategies

Use Infrastructure as Code (IaC) tools like AWS CDK, Terraform, or Serverless Framework. Implement CI/CD pipelines for automated testing and deployment. Use different environments (dev, staging, production) and implement gradual rollouts.

\`\`\`typescript
// AWS CDK example
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

const handler = new lambda.Function(this, 'Handler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromAsset('lambda'),
  handler: 'index.handler',
  environment: {
    DATABASE_URL: process.env.DATABASE_URL
  }
});

new apigateway.LambdaRestApi(this, 'Api', {
  handler: handler
});
\`\`\`

## Real-World Use Cases

Serverless excels for APIs with variable traffic, background job processing, scheduled tasks, webhook handlers, and image processing. It's ideal for applications with unpredictable load patterns or those that need to scale from zero to thousands of requests quickly.

Consider traditional hosting for applications with constant high traffic, long-running processes, or those requiring specific runtime environments.

## Best Practices

Implement proper monitoring and observability with CloudWatch, DataDog, or similar tools. Use async patterns for long-running tasks. Implement proper timeout and retry logic. Design for failure—serverless functions can fail, so handle errors gracefully.

Serverless architecture offers powerful capabilities but requires different thinking about application design and deployment. Understanding its strengths and limitations helps you make informed decisions about when and how to use it.`,
            published: false,
            createdAt: new Date('2024-02-20').toISOString(),
            updatedAt: new Date('2024-02-20').toISOString(),
        },
    ];

    await db.insert(posts).values(samplePosts);
    
    console.log('✅ Posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});