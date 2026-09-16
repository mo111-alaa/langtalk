create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  native_language text,
  target_language text,
  proficiency text,

  country text,

  free_calls_remaining integer
    not null
    default 5,

  onboarding_completed boolean
    not null
    default false,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint valid_language check (
    native_language in (
      'ar',
      'en',
      'es',
      'de',
      'fr',
      'ja',
      'ko',
      'ru',
      'tr'
    )
    or native_language is null
  ),

  constraint valid_target_language check (
    target_language in (
      'ar',
      'en',
      'es',
      'de',
      'fr',
      'ja',
      'ko',
      'ru',
      'tr'
    )
    or target_language is null
  ),

  constraint valid_proficiency check (
    proficiency in (
      'beginner',
      'intermediate',
      'advanced'
    )
    or proficiency is null
  ),

  constraint valid_credits check (
    free_calls_remaining >= 0
  )
);