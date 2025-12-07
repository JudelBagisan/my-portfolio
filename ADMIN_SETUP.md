# Portfolio Admin Panel - Setup Guide

## 🚀 Features

- **Secure Authentication** - Supabase Auth with cookie-based sessions
- **Project Management** - Full CRUD operations with image uploads
- **Row-Level Security** - Database-level security policies
- **Image Upload** - Drag-and-drop upload to Supabase Storage
- **Email Functionality** - Send emails to clients (requires configuration)
- **Responsive Design** - Mobile-friendly admin interface
- **Real-time Updates** - Automatic cache revalidation

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Node.js** - v18 or higher

## 🔧 Setup Instructions

### 1. Supabase Configuration

#### Create a new Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details

#### Run the database migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"
4. This will create:
   - `projects` table with all necessary fields
   - Row-Level Security (RLS) policies
   - `project-images` storage bucket
   - Storage policies
   - Triggers for automatic timestamp updates

#### Create an admin user

1. Go to **Authentication** > **Users** in your Supabase dashboard
2. Click "Add user"
3. Choose "Create new user"
4. Enter email and password
5. Click "Create user"

### 2. Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Email Configuration (Optional - for email functionality)
RESEND_API_KEY=your-resend-api-key-here
ADMIN_EMAIL=your-admin-email@example.com
\`\`\`

**Where to find these values:**

- **SUPABASE_URL**: Project Settings > API > Project URL
- **ANON_KEY**: Project Settings > API > anon public key
- **SERVICE_ROLE_KEY**: Project Settings > API > service_role key (keep this secret!)

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000/admin/login` to access the admin panel.

## 🎯 Admin Panel Features

### Pages

- **`/admin/login`** - Secure login page
- **`/admin`** - Dashboard with statistics
- **`/admin/add-project`** - Add new projects with image upload
- **`/admin/manage-projects`** - View, edit, delete, and toggle visibility
- **`/admin/send-email`** - Send emails to clients

### Security Features

1. **Protected Routes** - All admin routes require authentication
2. **Row-Level Security** - Database enforces access control
3. **Secure Image Upload** - Validation and size limits
4. **Cookie-based Auth** - Using @supabase/ssr package

## 📧 Email Functionality Setup (Optional)

To enable email sending, you need to integrate an email service:

### Option 1: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Install Resend:
   \`\`\`bash
   npm install resend
   \`\`\`
4. Update `src/app/admin/email-actions.ts` to uncomment the Resend code
5. Add `RESEND_API_KEY` to your `.env.local`

### Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Install SendGrid:
   \`\`\`bash
   npm install @sendgrid/mail
   \`\`\`
4. Update `src/app/admin/email-actions.ts` with SendGrid integration

## 🚀 Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
\`\`\`

### 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (if using email)
4. Click "Deploy"

### 3. Configure Supabase for Production

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your Vercel domain to **Site URL**
3. Add your Vercel domain to **Redirect URLs**

## 📱 Usage Guide

### Adding a Project

1. Login to admin panel
2. Click "Add Project" or navigate to `/admin/add-project`
3. Upload an image (drag-and-drop or click to browse)
4. Fill in all required fields
5. Choose visibility (public/hidden)
6. Click "Create Project"
7. Project automatically appears on home page and all-projects page

### Managing Projects

1. Navigate to `/admin/manage-projects`
2. Use search and filters to find projects
3. Click "Edit" to modify a project
4. Click status badge to toggle visibility
5. Click "Delete" to remove a project (with confirmation)

### Sending Emails

1. Navigate to `/admin/send-email`
2. Enter recipient email
3. Add subject and message
4. Optionally attach a file
5. Click "Send Email"

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use strong passwords** for admin accounts
3. **Enable 2FA** on your Supabase account
4. **Regularly update dependencies**
5. **Monitor Supabase logs** for suspicious activity
6. **Use HTTPS only** in production (Vercel does this automatically)

## 🐛 Troubleshooting

### "Failed to load projects"
- Check Supabase URL and keys in `.env.local`
- Verify RLS policies are set up correctly
- Check browser console for errors

### "Image upload failed"
- Ensure storage bucket `project-images` exists
- Check storage policies in Supabase
- Verify file size is under 5MB

### "Redirect to login after refresh"
- Clear browser cookies
- Check middleware configuration
- Verify auth session is valid

### Email not sending
- Verify email service is configured
- Check API key is correct
- Review server logs for errors

## 📚 Tech Stack

- **Next.js 14+** - App Router, Server Actions
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database, Auth, Storage
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **React Hot Toast** - Notifications

## 🔄 Database Schema

### Projects Table

\`\`\`sql
- id (UUID, Primary Key)
- title (Text)
- category (Text)
- tags (Text Array)
- image_url (Text)
- description (Text)
- year (Text)
- role (Text)
- is_public (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)
\`\`\`

## 🎨 Customization

### Changing Colors

Edit `src/app/globals.css` to modify color variables:

\`\`\`css
.bg-accent-100 { background-color: #7700ff; }
.bg-customgrey-100 { background-color: #313546; }
.bg-customdarkgrey-100 { background-color: #232633; }
\`\`\`

### Adding New Project Categories

1. Update form select options in `add-project/page.tsx`
2. Update filter select in `manage-projects/page.tsx`
3. Update filter buttons in `allprojects/page.tsx`

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Next.js documentation

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] Database migration executed
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] Storage bucket created
- [ ] RLS policies verified
- [ ] Test login functionality
- [ ] Test project CRUD operations
- [ ] Test image upload
- [ ] Repository pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Environment variables added to Vercel
- [ ] Production site tested

---

**Happy Building! 🚀**
