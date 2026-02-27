-- RLS for teacher_subject_mappings
CREATE POLICY "Teachers can read own mappings" ON public.teacher_subject_mappings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.teachers WHERE id = teacher_id AND user_id = auth.uid())
);
CREATE POLICY "Super admins can manage mappings" ON public.teacher_subject_mappings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for tests
CREATE POLICY "Students can read tests for their class" ON public.tests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.user_id = auth.uid()
    AND s.class_id = tests.class_id
    AND s.section_id = tests.section_id
  )
);
CREATE POLICY "Subject teachers can manage tests" ON public.tests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.teacher_subject_mappings tsm ON tsm.teacher_id = t.id
    WHERE t.user_id = auth.uid()
    AND tsm.subject_id = tests.subject_id
    AND tsm.class_id = tests.class_id
    AND tsm.section_id = tests.section_id
  )
);
CREATE POLICY "Super admins can read all tests" ON public.tests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for marks
CREATE POLICY "Students can read own marks" ON public.marks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Subject teachers can manage marks" ON public.marks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.tests test ON test.id = marks.test_id
    JOIN public.teacher_subject_mappings tsm ON tsm.teacher_id = t.id AND tsm.subject_id = test.subject_id
    WHERE t.user_id = auth.uid()
  )
);
CREATE POLICY "Class teachers can read class marks" ON public.marks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.students s ON s.class_id = t.assigned_class_id AND s.section_id = t.assigned_section_id
    WHERE t.user_id = auth.uid() AND t.is_class_teacher = true AND s.id = marks.student_id
  )
);

-- RLS for behavior
CREATE POLICY "Students can read own behavior" ON public.behavior FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Teachers can manage behavior for their students" ON public.behavior FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.user_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM public.students s
        WHERE s.id = behavior.student_id
        AND (s.class_id = t.assigned_class_id OR EXISTS (
          SELECT 1 FROM public.teacher_subject_mappings tsm
          WHERE tsm.teacher_id = t.id AND tsm.class_id = s.class_id
        ))
      )
    )
  )
);
CREATE POLICY "Class teachers can read all behavior in their class" ON public.behavior FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.students s ON s.class_id = t.assigned_class_id
    WHERE t.user_id = auth.uid() AND t.is_class_teacher = true AND s.id = behavior.student_id
  )
);

-- RLS for daily_topics
CREATE POLICY "Students can read topics for their class" ON public.daily_topics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.user_id = auth.uid()
    AND s.class_id = daily_topics.class_id
    AND s.section_id = daily_topics.section_id
  )
);
CREATE POLICY "Subject teachers can manage daily topics" ON public.daily_topics FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.teacher_subject_mappings tsm ON tsm.teacher_id = t.id
    WHERE t.user_id = auth.uid()
    AND tsm.subject_id = daily_topics.subject_id
    AND tsm.class_id = daily_topics.class_id
    AND tsm.section_id = daily_topics.section_id
  )
);
CREATE POLICY "Class teachers can read topics in their class" ON public.daily_topics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    WHERE t.user_id = auth.uid()
    AND t.is_class_teacher = true
    AND t.assigned_class_id = daily_topics.class_id
  )
);

-- RLS for fees
CREATE POLICY "Students can read own fees" ON public.fees FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Class teachers can manage fees" ON public.fees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.students s ON s.class_id = t.assigned_class_id AND s.section_id = t.assigned_section_id
    WHERE t.user_id = auth.uid() AND t.is_class_teacher = true AND s.id = fees.student_id
  )
);
CREATE POLICY "Super admins can read all fees" ON public.fees FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
);

-- RLS for leave_requests
CREATE POLICY "Students can manage own leave requests" ON public.leave_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid())
);
CREATE POLICY "Class teachers can manage leave requests" ON public.leave_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.students s ON s.class_id = t.assigned_class_id AND s.section_id = t.assigned_section_id
    WHERE t.user_id = auth.uid() AND t.is_class_teacher = true AND s.id = leave_requests.student_id
  )
);