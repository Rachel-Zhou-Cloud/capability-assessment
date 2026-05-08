-- 能力评估平台数据库 Schema
-- 在 Supabase SQL Editor 中执行此文件

-- 1. 用户信息表
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  employee_id text unique,
  department_l3 text not null default '',
  department_l4 text default '',
  role text not null default 'employee' check (role in ('employee', 'supervisor', 'hr', 'admin')),
  supervisor_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- 2. 评估周期表
create table if not exists assessment_periods (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  score_levels integer not null default 5,
  created_at timestamptz default now()
);

-- 3. 评估记录表
create table if not exists assessments (
  id uuid default gen_random_uuid() primary key,
  period_id uuid references assessment_periods(id) on delete cascade not null,
  target_user_id uuid references profiles(id) on delete cascade not null,
  assessor_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('self', 'supervisor')),
  s1_government_kpi integer check (s1_government_kpi between 1 and 5),
  s2_business_understanding integer check (s2_business_understanding between 1 and 5),
  s3_relationship_building integer check (s3_relationship_building between 1 and 5),
  s4_risk_management integer check (s4_risk_management between 1 and 5),
  s5_reporting integer check (s5_reporting between 1 and 5),
  s6_mindset integer check (s6_mindset between 1 and 5),
  s7_negotiation integer check (s7_negotiation between 1 and 5),
  s8_ai_competency integer check (s8_ai_competency between 1 and 5),
  s9_curiosity integer check (s9_curiosity between 1 and 5),
  comments text default '',
  submitted_at timestamptz default now(),
  department_l3 text default '',
  department_l4 text default '',
  unique(period_id, target_user_id, type, assessor_id)
);

-- 4. 能力字典表
create table if not exists capability_definitions (
  id text primary key,
  name text not null,
  description text default '',
  level_1_desc text default '',
  level_2_desc text default '',
  level_3_desc text default '',
  level_4_desc text default '',
  level_5_desc text default '',
  suggestion_low text default '',
  suggestion_mid text default '',
  suggestion_high text default ''
);

-- Row Level Security (RLS) 策略

-- profiles 表
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Supervisors can view team profiles"
  on profiles for select using (
    auth.uid() in (
      select id from profiles where role in ('supervisor', 'hr', 'admin')
    )
  );

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- assessments 表
alter table assessments enable row level security;

create policy "Users can view own assessments"
  on assessments for select using (
    auth.uid() = target_user_id or auth.uid() = assessor_id
  );

create policy "Supervisors can view team assessments"
  on assessments for select using (
    auth.uid() in (
      select id from profiles where role in ('supervisor', 'hr', 'admin')
    )
  );

create policy "Users can insert self assessment"
  on assessments for insert with check (
    auth.uid() = assessor_id and (
      (type = 'self' and auth.uid() = target_user_id) or
      (type = 'supervisor' and auth.uid() in (
        select id from profiles where role in ('supervisor', 'hr', 'admin')
      ))
    )
  );

-- assessment_periods 表
alter table assessment_periods enable row level security;

create policy "Everyone can view periods"
  on assessment_periods for select using (true);

create policy "Only HR/admin can manage periods"
  on assessment_periods for all using (
    auth.uid() in (
      select id from profiles where role in ('hr', 'admin')
    )
  );

-- capability_definitions 表
alter table capability_definitions enable row level security;

create policy "Everyone can view capabilities"
  on capability_definitions for select using (true);
