# AI Prompt Library

A personal web application for managing AI prompts and rules. Built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## Features

- **Authentication System**: Secure login with email/password and Google OAuth
- **CRUD Operations**: Create, read, update, and delete prompts and rules
- **One-Click Copy**: Copy prompts to clipboard with a single click
- **Filter & Search**: Filter by All, Prompts, or Rules
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Automatic data synchronization with Supabase
- **Modern UI**: Clean, minimalist design with hover interactions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter (UI) and JetBrains Mono (code)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd promptina
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your URL and anon key
   - Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database:
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Run the SQL commands from `supabase/schema.sql`

6. Configure authentication providers (optional):
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider if you want social login
   - Add your site URL to the allowed origins

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses a simple database schema with Row Level Security (RLS):

```sql
-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  type VARCHAR(10) CHECK (type IN ('prompt', 'rule')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application page
│   ├── login/
│   │   └── page.tsx        # Authentication page
│   └── globals.css         # Global styles
├── components/
│   ├── FilterTabs.tsx      # Filter buttons component
│   ├── FloatingActionButton.tsx  # Add button component
│   ├── Header.tsx          # App header with user info
│   ├── ItemCard.tsx        # Individual item display
│   └── ItemModal.tsx       # Create/edit modal
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   └── useItems.ts         # CRUD operations hooks
├── lib/
│   ├── providers.tsx       # React Query provider
│   ├── types.ts            # TypeScript types
│   └── supabase/
│       ├── client.ts       # Supabase client config
│       └── server.ts       # Server-side Supabase client
└── middleware.ts           # Route protection middleware
```

## Features in Detail

### Authentication
- Email/password authentication
- Google OAuth integration
- Protected routes with automatic redirects
- Session management

### Item Management
- Create new prompts and rules
- Edit existing items
- Delete items with confirmation
- Copy content to clipboard with feedback

### UI/UX
- Responsive grid layout (1-4 columns based on screen size)
- Hover-to-reveal action buttons
- Smooth transitions and animations
- Loading states and error handling
- Accessibility features (ARIA labels, keyboard navigation)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.