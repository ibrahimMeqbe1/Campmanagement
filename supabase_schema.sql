-- ========================================================
-- سكربت إنشاء وتحديث جداول مشروع إدارة المخيمات على Supabase
-- قم بنسخ هذا السكربت وتشغيله في Supabase -> SQL Editor -> Run
-- ========================================================

-- 1. جدول العائلات (families)
CREATE TABLE IF NOT EXISTS public.families (
    id TEXT PRIMARY KEY,
    camp_id TEXT NOT NULL DEFAULT 'kareem',
    name TEXT NOT NULL,
    id_number TEXT,
    phone TEXT,
    members_count INTEGER DEFAULT 1,
    location TEXT,
    status TEXT,
    dob TEXT,
    wife_name TEXT,
    wife_id TEXT,
    wife_dob TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تحديث أعمدة العائلات في حال وجود الجدول سابقاً
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS camp_id TEXT DEFAULT 'kareem';
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS wife_name TEXT;
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS wife_id TEXT;
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS wife_dob TEXT;
ALTER TABLE public.families ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. جدول الترشيحات (nominations)
CREATE TABLE IF NOT EXISTS public.nominations (
    id TEXT PRIMARY KEY,
    camp_id TEXT NOT NULL DEFAULT 'kareem',
    name TEXT NOT NULL,
    id_number TEXT,
    phone TEXT,
    members_count INTEGER DEFAULT 1,
    location TEXT,
    status TEXT,
    has_disabled INTEGER DEFAULT 0,
    has_chronic_disease INTEGER DEFAULT 0,
    is_lactating_or_pregnant INTEGER DEFAULT 0,
    is_female_headed INTEGER DEFAULT 0,
    dob TEXT,
    wife_name TEXT,
    wife_id TEXT,
    wife_dob TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تحديث أعمدة الترشيحات في حال وجود الجدول سابقاً
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS camp_id TEXT DEFAULT 'kareem';
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS has_disabled INTEGER DEFAULT 0;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS has_chronic_disease INTEGER DEFAULT 0;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS is_lactating_or_pregnant INTEGER DEFAULT 0;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS is_female_headed INTEGER DEFAULT 0;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS wife_name TEXT;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS wife_id TEXT;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS wife_dob TEXT;
ALTER TABLE public.nominations ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. جدول المخيمات (camps)
CREATE TABLE IF NOT EXISTS public.camps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    manager_name TEXT,
    phone TEXT,
    families_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_expiry TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تحديث أعمدة المخيمات في حال وجود الجدول سابقاً
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS manager_name TEXT;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS families_count INTEGER DEFAULT 0;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. جدول المستخدمين والمصادقة (users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    camp_id TEXT NOT NULL DEFAULT 'kareem',
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تحديث أعمدة المستخدمين
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS camp_id TEXT DEFAULT 'kareem';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;

-- 5. جدول طلبات تجديد الاشتراكات (renewal_requests)
CREATE TABLE IF NOT EXISTS public.renewal_requests (
    id TEXT PRIMARY KEY,
    camp_id TEXT NOT NULL,
    camp_name TEXT NOT NULL,
    requested_months INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending',
    request_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- 6. جدول الإعلانات والتنبيهات (announcements)
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- إضافة البيانات الافتراضية الأولية (Initial Data)
-- ========================================================

-- إضافة المخيمات الافتراضية
INSERT INTO public.camps (id, name, location, manager_name, phone, is_active, subscription_expiry)
VALUES 
  ('kareem', 'مخيم كريم', 'غزة - الوسطى', 'أبو كريم', '0599000000', TRUE, NOW() + INTERVAL '1 year'),
  ('zad-al-khair', 'مخيم زاد الخير', 'غزة - خانيونس', 'أبو أحمد', '0599111111', TRUE, NOW() + INTERVAL '1 year')
ON CONFLICT (id) DO UPDATE SET
  location = EXCLUDED.location,
  manager_name = EXCLUDED.manager_name,
  phone = EXCLUDED.phone;

-- إضافة المستخدمين الافتراضيين
INSERT INTO public.users (id, username, password, role, camp_id, name)
VALUES 
  ('user-superadmin', 'Ibrahim', '123456', 'superadmin', 'system', 'Eng: Ibrahim Meqbel'),
  ('user-y2000', 'Y2000', '123456', 'admin', 'kareem', 'مخيم كريم'),
  ('user-i2000', 'I2000', '123456', 'admin', 'kareem', 'مخيم كريم')
ON CONFLICT (username) DO NOTHING;

-- ========================================================
-- سياسات الوصول الشامل (Allow ALL Policies for anon / public)
-- ========================================================
DO $$
BEGIN
    -- جدول العائلات
    ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "allow_all_families" ON public.families;
    CREATE POLICY "allow_all_families" ON public.families FOR ALL USING (true) WITH CHECK (true);

    -- جدول الترشيحات
    ALTER TABLE public.nominations ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "allow_all_nominations" ON public.nominations;
    CREATE POLICY "allow_all_nominations" ON public.nominations FOR ALL USING (true) WITH CHECK (true);

    -- جدول المخيمات
    ALTER TABLE public.camps ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "allow_all_camps" ON public.camps;
    CREATE POLICY "allow_all_camps" ON public.camps FOR ALL USING (true) WITH CHECK (true);

    -- جدول المستخدمين
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "allow_all_users" ON public.users;
    CREATE POLICY "allow_all_users" ON public.users FOR ALL USING (true) WITH CHECK (true);

    -- جدول طلبات التجديد
    ALTER TABLE public.renewal_requests ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "allow_all_renewal_requests" ON public.renewal_requests;
    CREATE POLICY "allow_all_renewal_requests" ON public.renewal_requests FOR ALL USING (true) WITH CHECK (true);

    -- جدول الإعلانات
    ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "allow_all_announcements" ON public.announcements;
    CREATE POLICY "allow_all_announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ========================================================
-- تفعيل التحديثات الفورية (Realtime) للجداول
-- ========================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;
