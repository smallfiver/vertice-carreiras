-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text unique not null,
    perfectpay_sale_code text,
    is_admin boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. JOBS
create table public.jobs (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    company_name text not null,
    logo_url text,
    salary_range text not null,
    description text not null,
    requirements text[] not null,
    benefits text[] not null,
    application_url text not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. MODULES
create table public.modules (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    sequence_order integer not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. LESSONS
create table public.lessons (
    id uuid default gen_random_uuid() primary key,
    module_id uuid references public.modules on delete cascade not null,
    title text not null,
    description text,
    video_url text not null,
    sequence_order integer not null,
    content text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (module_id, sequence_order)
);

-- 5. USER LESSON PROGRESS
create table public.user_lesson_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles on delete cascade not null,
    lesson_id uuid references public.lessons on delete cascade not null,
    completed boolean default false,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    unique (user_id, lesson_id)
);

-- 6. APPLICATIONS
create table public.applications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles on delete cascade not null,
    job_id uuid references public.jobs on delete cascade not null,
    applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, job_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.applications enable row level security;

create policy "Usuários podem ver seu próprio perfil" on public.profiles
    for select using (auth.uid() = id);
create policy "Admins podem ver todos os perfis" on public.profiles
    for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Usuários autenticados veem vagas ativas" on public.jobs
    for select using (auth.role() = 'authenticated' and is_active = true);
create policy "Admins controle total vagas" on public.jobs
    for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Autenticados veem modulos" on public.modules
    for select using (auth.role() = 'authenticated');
create policy "Admins controle total modulos" on public.modules
    for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Autenticados veem aulas" on public.lessons
    for select using (auth.role() = 'authenticated');
create policy "Admins controle total aulas" on public.lessons
    for all using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Usuarios veem seu progresso" on public.user_lesson_progress
    for all using (auth.uid() = user_id);
create policy "Admins veem todo progresso" on public.user_lesson_progress
    for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Usuarios criam suas candidaturas" on public.applications
    for all using (auth.uid() = user_id);
create policy "Admins veem candidaturas" on public.applications
    for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
