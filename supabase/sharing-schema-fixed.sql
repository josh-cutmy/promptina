-- Add sharing functionality to the AI Prompt Library

-- 1. Create user_profiles table for display names and @ mentions
CREATE TABLE public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  display_name text,
  username text unique,
  avatar_url text
);

-- 2. Create shared_items table to track sharing
CREATE TABLE public.shared_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  item_id uuid references public.items(id) on delete cascade not null,
  shared_by uuid references auth.users(id) on delete cascade not null,
  shared_with uuid references auth.users(id) on delete cascade not null,
  permission text default 'read' check (permission in ('read', 'write')),
  message text,
  is_active boolean default true
);

-- 3. Enable RLS on new tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_items ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles for sharing"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Create RLS policies for shared_items
CREATE POLICY "Users can view items shared with them"
  ON public.shared_items FOR SELECT
  USING (auth.uid() = shared_with OR auth.uid() = shared_by);

CREATE POLICY "Users can share their own items"
  ON public.shared_items FOR INSERT
  WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM public.items 
      WHERE items.id = shared_items.item_id 
      AND items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own shared items"
  ON public.shared_items FOR DELETE
  USING (auth.uid() = shared_by);

CREATE POLICY "Users can update sharing they created"
  ON public.shared_items FOR UPDATE
  USING (auth.uid() = shared_by);

-- 6. Create indexes for performance
CREATE INDEX shared_items_item_id_idx ON public.shared_items(item_id);
CREATE INDEX shared_items_shared_with_idx ON public.shared_items(shared_with);
CREATE INDEX shared_items_shared_by_idx ON public.shared_items(shared_by);
CREATE INDEX user_profiles_email_idx ON public.user_profiles(email);
CREATE INDEX user_profiles_username_idx ON public.user_profiles(username);

-- 7. Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();