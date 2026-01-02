-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create push subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  announcements_enabled BOOLEAN NOT NULL DEFAULT true,
  homework_enabled BOOLEAN NOT NULL DEFAULT true,
  fees_enabled BOOLEAN NOT NULL DEFAULT true,
  attendance_enabled BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for push_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own subscriptions"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own subscriptions"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- RLS policies for notification_preferences
CREATE POLICY "Users can view their own preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();