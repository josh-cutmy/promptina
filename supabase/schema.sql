-- Create the items table
create table public.items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  content text not null,
  type varchar(10) not null check (type in ('prompt', 'rule')),
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security (RLS)
alter table public.items enable row level security;

-- Create policies
create policy "Users can view their own items"
  on public.items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own items"
  on public.items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own items"
  on public.items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own items"
  on public.items for delete
  using (auth.uid() = user_id);

-- Create an index for better performance
create index items_user_id_idx on public.items(user_id);
create index items_type_idx on public.items(type);
create index items_created_at_idx on public.items(created_at desc);