# Dynamic Portfolio - Database Integration

## Overview
The homepage and All Projects page are now fully dynamic, fetching real project data from your Supabase database instead of using hardcoded data.

## Changes Made

### 1. Homepage (`src/app/page.tsx`)
- **Converted to Server Component**: Fetches the 3 most recent public projects from Supabase
- **Data Source**: Supabase `projects` table
- **Query**: Fetches projects where `is_public = true`, ordered by `created_at` descending, limited to 3
- **UI Component**: Renders `HomeClient` with dynamic project data

### 2. All Projects Page (`src/app/allprojects/page.tsx`)
- **Converted to Server Component**: Fetches all public projects from Supabase
- **Data Source**: Supabase `projects` table  
- **Query**: Fetches all projects where `is_public = true`, ordered by `created_at` descending
- **UI Component**: Renders `AllProjectsClient` with dynamic project data

### 3. New Client Components
- **`src/components/HomeClient.tsx`**: Contains all interactive UI logic for the homepage (mobile menu, project modal, etc.)
- **`src/components/AllProjectsClient.tsx`**: Contains filtering, categorization, and modal logic for the All Projects page

## Data Flow

```
Database (Supabase)
    ↓
Server Component (page.tsx)
    ↓
Client Component (HomeClient/AllProjectsClient)
    ↓
User Interface
```

## Project Schema

The pages now expect projects with the following structure:

```typescript
interface Project {
  id: string;              // UUID from database
  title: string;           // Project title
  category: string;        // E.g., "Design", "Shirts", "Publications"
  tags: string[];          // Array of tags
  image_url: string;       // Supabase Storage URL
  description: string;     // Project description
  year: string;            // Project year
  role: string;            // Your role (e.g., "Lead Designer")
  is_public: boolean;      // Visibility flag
}
```

## How It Works

### Homepage
1. Server Component fetches 3 most recent public projects
2. Projects are passed to `HomeClient`
3. Projects populate the portfolio section
4. Clicking a project opens a modal with full details

### All Projects Page
1. Server Component fetches all public projects
2. Projects are passed to `AllProjectsClient`
3. Client component groups projects by category
4. Filter buttons allow users to view all or filter by category
5. Projects are displayed with category dividers
6. Clicking a project opens a modal with full details

## Features Preserved

✅ Mobile-responsive design
✅ Project filtering by category
✅ Category dividers with gradient lines
✅ Project modal with full details
✅ Hover effects and animations
✅ Image optimization via Next.js Image component

## Admin Panel Integration

When you add, edit, or delete projects in the admin panel:
- Homepage automatically shows the 3 most recent projects
- All Projects page automatically includes/excludes projects based on visibility
- Changes are reflected immediately after page refresh (Next.js caching)

## Next Steps

1. **Add Projects**: Use the admin panel at `/admin/add-project` to add your real projects
2. **Upload Images**: Images are stored in Supabase Storage and automatically configured
3. **Manage Visibility**: Toggle project visibility in `/admin/manage-projects`
4. **Categorize**: Assign categories to organize projects (Design, Shirts, Publications, or custom)

## Environment Setup

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Requirements

- Supabase project must be created
- Migration `001_initial_schema.sql` must be run
- Projects table must exist with RLS policies enabled

## Testing

1. Start the dev server: `npm run dev`
2. Visit homepage: `http://localhost:3000`
3. Visit all projects: `http://localhost:3000/allprojects`
4. Add projects via admin panel: `http://localhost:3000/admin/add-project`
5. Verify projects appear on both pages

---

**Note**: The pages will show empty states if no public projects exist in the database. Add at least 3 projects to see the full homepage design.
