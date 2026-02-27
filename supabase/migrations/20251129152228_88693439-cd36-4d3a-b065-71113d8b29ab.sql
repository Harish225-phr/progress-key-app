-- Create enum types
CREATE TYPE user_role AS ENUM ('school_admin', 'CLASS_TEACHER', 'SUBJECT_TEACHER', 'STUDENT_PARENT');
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE fee_status AS ENUM ('PENDING', 'PAID');

-- Users table with role
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role user_role NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Sections table
CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  section_id uuid REFERENCES public.sections(id) ON DELETE SET NULL,
  roll_number text,
  admission_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  employee_id text UNIQUE,
  joined_date date DEFAULT CURRENT_DATE,
  is_class_teacher boolean DEFAULT false,
  assigned_class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  assigned_section_id uuid REFERENCES public.sections(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Teacher-Subject-Class-Section mappings
CREATE TABLE IF NOT EXISTS public.teacher_subject_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_id, section_id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  is_present boolean NOT NULL DEFAULT true,
  marked_by uuid REFERENCES public.teachers(id),
  remarks text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Homework table
CREATE TABLE IF NOT EXISTS public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  due_date date NOT NULL,
  assigned_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Study Materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text,
  file_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- Tests table
CREATE TABLE IF NOT EXISTS public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  max_marks integer NOT NULL,
  test_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Marks table
CREATE TABLE IF NOT EXISTS public.marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained integer NOT NULL,
  remarks text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(test_id, student_id)
);

-- Behavior tracking table
CREATE TABLE IF NOT EXISTS public.behavior (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  remark text NOT NULL,
  behavior_type text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Daily topics taught table
CREATE TABLE IF NOT EXISTS public.daily_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  topic text NOT NULL,
  description text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  target_class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  target_section_id uuid REFERENCES public.sections(id) ON DELETE CASCADE,
  is_school_wide boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Fees table
CREATE TABLE IF NOT EXISTS public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  due_date date NOT NULL,
  status fee_status DEFAULT 'PENDING',
  payment_date date,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status leave_status DEFAULT 'PENDING',
  reviewed_by uuid REFERENCES public.teachers(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subject_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (everyone can read their own data)
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admins can read all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for classes, sections, subjects (readable by authenticated users)
CREATE POLICY "Authenticated users can read classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage classes" ON public.classes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

CREATE POLICY "Authenticated users can read sections" ON public.sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage sections" ON public.sections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

CREATE POLICY "Authenticated users can read subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage subjects" ON public.subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for students
CREATE POLICY "Students can read own data" ON public.students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Teachers can read students in their class" ON public.students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.user_id = auth.uid()
    AND (t.assigned_class_id = students.class_id OR EXISTS (
      SELECT 1 FROM public.teacher_subject_mappings tsm
      WHERE tsm.teacher_id = t.id AND tsm.class_id = students.class_id
    ))
  )
);
CREATE POLICY "Super admins can read all students" ON public.students FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for teachers
CREATE POLICY "Teachers can read own data" ON public.teachers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "All authenticated can read teachers" ON public.teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage teachers" ON public.teachers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for attendance
CREATE POLICY "Students can read own attendance" ON public.attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Class teachers can manage attendance" ON public.attendance FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.students s ON s.class_id = t.assigned_class_id AND s.section_id = t.assigned_section_id
    WHERE t.user_id = auth.uid() AND s.id = attendance.student_id AND t.is_class_teacher = true
  )
);

-- RLS for homework
CREATE POLICY "Students can read homework for their class" ON public.homework FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.user_id = auth.uid()
    AND s.class_id = homework.class_id
    AND s.section_id = homework.section_id
  )
);
CREATE POLICY "Subject teachers can manage homework" ON public.homework FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.teacher_subject_mappings tsm ON tsm.teacher_id = t.id
    WHERE t.user_id = auth.uid()
    AND tsm.subject_id = homework.subject_id
    AND tsm.class_id = homework.class_id
    AND tsm.section_id = homework.section_id
  )
);

-- RLS for materials
CREATE POLICY "Students can read materials for their class" ON public.materials FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.user_id = auth.uid()
    AND s.class_id = materials.class_id
    AND s.section_id = materials.section_id
  )
);
CREATE POLICY "Subject teachers can manage materials" ON public.materials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.teacher_subject_mappings tsm ON tsm.teacher_id = t.id
    WHERE t.user_id = auth.uid()
    AND tsm.subject_id = materials.subject_id
    AND tsm.class_id = materials.class_id
    AND tsm.section_id = materials.section_id
  )
);

-- RLS for announcements
CREATE POLICY "All authenticated can read announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin can create school-wide announcements" ON public.announcements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);
CREATE POLICY "Class teachers can create class announcements" ON public.announcements FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.user_id = auth.uid()
    AND t.is_class_teacher = true
    AND t.assigned_class_id = announcements.target_class_id
  )
);

-- Insert hardcoded users (Note: In production, passwords should be properly hashed)
INSERT INTO public.users (email, password_hash, role, full_name) VALUES
  ('superadmin@gmail.com', 'abc123', 'school_admin', 'Principal Admin'),
  ('classteacher@gmail.com', 'abc123', 'CLASS_TEACHER', 'Class Teacher'),
  ('subjectteacher@gmail.com', 'abc123', 'SUBJECT_TEACHER', 'Subject Teacher'),
  ('parentchild@gmail.com', 'abc123', 'STUDENT_PARENT', 'Parent Student');

-- Create sample data
INSERT INTO public.classes (name, description) VALUES
  ('Class 10', 'Senior Secondary Class 10'),
  ('Class 9', 'Secondary Class 9');

INSERT INTO public.sections (class_id, name)
SELECT id, 'A' FROM public.classes WHERE name = 'Class 10'
UNION ALL
SELECT id, 'B' FROM public.classes WHERE name = 'Class 10';

INSERT INTO public.subjects (name, description) VALUES
  ('Mathematics', 'Mathematics and Problem Solving'),
  ('Science', 'Physics, Chemistry, Biology'),
  ('English', 'English Language and Literature'),
  ('History', 'World and Indian History');

-- Insert teachers
INSERT INTO public.teachers (user_id, employee_id, is_class_teacher, assigned_class_id, assigned_section_id)
SELECT 
  u.id,
  'CT001',
  true,
  c.id,
  s.id
FROM public.users u
CROSS JOIN public.classes c
CROSS JOIN public.sections s
WHERE u.email = 'classteacher@gmail.com'
AND c.name = 'Class 10'
AND s.name = 'A'
LIMIT 1;

INSERT INTO public.teachers (user_id, employee_id, is_class_teacher)
SELECT id, 'ST001', false
FROM public.users
WHERE email = 'subjectteacher@gmail.com';

-- Insert student
INSERT INTO public.students (user_id, class_id, section_id, roll_number)
SELECT 
  u.id,
  c.id,
  s.id,
  '001'
FROM public.users u
CROSS JOIN public.classes c
CROSS JOIN public.sections s
WHERE u.email = 'parentchild@gmail.com'
AND c.name = 'Class 10'
AND s.name = 'A'
LIMIT 1;

-- Map subject teacher to subjects
INSERT INTO public.teacher_subject_mappings (teacher_id, subject_id, class_id, section_id)
SELECT 
  t.id,
  sub.id,
  c.id,
  s.id
FROM public.teachers t
CROSS JOIN public.subjects sub
CROSS JOIN public.classes c
CROSS JOIN public.sections s
WHERE t.employee_id = 'ST001'
AND sub.name IN ('Mathematics', 'Science')
AND c.name = 'Class 10'
AND s.name = 'A';

-- Insert sample homework
INSERT INTO public.homework (teacher_id, subject_id, class_id, section_id, title, description, due_date)
SELECT 
  t.id,
  sub.id,
  c.id,
  s.id,
  'Algebra Practice',
  'Complete exercises 1-10 from Chapter 3',
  CURRENT_DATE + INTERVAL '3 days'
FROM public.teachers t
CROSS JOIN public.subjects sub
CROSS JOIN public.classes c
CROSS JOIN public.sections s
WHERE t.employee_id = 'ST001'
AND sub.name = 'Mathematics'
AND c.name = 'Class 10'
AND s.name = 'A'
LIMIT 1;

-- Insert sample attendance
INSERT INTO public.attendance (student_id, date, is_present, marked_by)
SELECT 
  st.id,
  CURRENT_DATE,
  true,
  t.id
FROM public.students st
CROSS JOIN public.teachers t
WHERE st.roll_number = '001'
AND t.employee_id = 'CT001'
LIMIT 1;

-- Insert sample announcement
INSERT INTO public.announcements (created_by, title, content, is_school_wide)
SELECT 
  id,
  'Welcome to School Progress System',
  'All students and parents can now track progress online!',
  true
FROM public.users
WHERE email = 'superadmin@gmail.com'
LIMIT 1;