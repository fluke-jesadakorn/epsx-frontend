-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('web3', 'manual')),
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Service Visibility Table
CREATE TABLE IF NOT EXISTS service_visibility (
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, role_id)
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Payment Information Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Terms Acceptance Table
CREATE TABLE IF NOT EXISTS terms_acceptance (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, version)
);

-- Enable RLS on all new tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms_acceptance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services table
CREATE POLICY "Authenticated users can read visible services" ON services
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM service_visibility sv
    JOIN user_roles ur ON sv.role_id = ur.role_id
    WHERE sv.service_id = services.id
    AND ur.user_id = auth.uid()
  )
);

-- RLS Policies for news table
CREATE POLICY "Authenticated users can read news" ON news
FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for user_settings table
CREATE POLICY "Users can manage their own settings" ON user_settings
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for payments table
CREATE POLICY "Users can manage their own payments" ON payments
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for terms_acceptance table
CREATE POLICY "Users can manage their own terms acceptance" ON terms_acceptance
FOR ALL USING (auth.uid() = user_id);
