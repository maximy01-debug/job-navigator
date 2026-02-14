-- Job Navigator Database Schema
-- Supabase에서 실행할 SQL 스크립트

-- 1. Users 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  school_name TEXT,
  major TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Roadmaps 테이블 (3년 로드맵)
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL CHECK (grade IN (1, 2, 3)), -- 1학년, 2학년, 3학년
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Daily Goals 테이블
CREATE TABLE IF NOT EXISTS public.daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Projects 테이블 (포트폴리오)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  tech_stack TEXT[], -- 배열 타입으로 여러 기술 스택 저장
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  tags TEXT[], -- 배열 타입으로 여러 태그 저장
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_grade ON public.roadmaps(grade);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_id ON public.daily_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_goals_date ON public.daily_goals(date);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정 (사용자는 자신의 데이터만 접근 가능)

-- Users 정책
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Roadmaps 정책
CREATE POLICY "Users can view own roadmaps"
  ON public.roadmaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own roadmaps"
  ON public.roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps"
  ON public.roadmaps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps"
  ON public.roadmaps FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Goals 정책
CREATE POLICY "Users can view own daily goals"
  ON public.daily_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own daily goals"
  ON public.daily_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily goals"
  ON public.daily_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily goals"
  ON public.daily_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Projects 정책
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER daily_goals_updated_at
  BEFORE UPDATE ON public.daily_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
