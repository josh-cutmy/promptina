# Setup Instructions

## Quick Start

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be fully initialized

2. **Get your Supabase credentials**:
   - Go to Settings > API
   - Copy your `Project URL` and `public anon key`

3. **Update environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and replace:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

4. **Set up the database**:
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL commands

5. **Install dependencies and start**:
   ```bash
   npm install
   npm run dev
   ```

6. **Open the app**:
   - Visit [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to the login page
   - Create an account or sign in

## Optional: Google Authentication

1. **Enable Google Provider**:
   - Go to Authentication > Providers in Supabase
   - Enable Google
   - Add your site URL (http://localhost:3000 for development)

2. **Get Google OAuth credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

## Troubleshooting

- **Database connection issues**: Make sure your Supabase project is active and the URL/key are correct
- **Authentication not working**: Check that RLS policies are properly set up
- **Build errors**: Ensure all dependencies are installed with `npm install`
- **TypeScript errors**: Run `npm run build` to check for type errors

## Development Tips

- Use `npm run dev` for development with hot reload
- Check the browser console for any JavaScript errors
- Use the Network tab to debug API calls
- The React Query DevTools are available in development mode