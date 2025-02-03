-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}'
);

-- Create user_roles table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Create stock_visibility table
CREATE TABLE IF NOT EXISTS stock_visibility (
  stock_id TEXT NOT NULL,
  role_id TEXT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (stock_id, role_id)
);

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_visibility ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Authenticated users can read roles" ON roles
FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for user_roles table
CREATE POLICY "Users can read their own roles" ON user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles" ON user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = 'admin'
  )
);

-- RLS Policies for stock_visibility table
CREATE POLICY "Authenticated users can read visible stocks" ON stock_visibility
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = stock_visibility.role_id
  )
);

CREATE POLICY "Admins can manage stock visibility" ON stock_visibility
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role_id = 'admin'
  )
);

-- Insert default roles if they don't exist
INSERT INTO roles (id, name, description, permissions)
VALUES 
  ('admin', 'Administrator', 'Full access to all features', '{"projects": ["read", "write", "manage"], "settings": ["read", "write", "manage"], "users": ["read", "write", "manage"], "services": ["read", "write", "manage"]}'),
  ('editor', 'Editor', 'Can create and edit content', '{"projects": ["read", "write"], "services": ["read", "write"]}'),
  ('viewer', 'Viewer', 'Read-only access', '{"projects": ["read"], "services": ["read"]}')
ON CONFLICT (id) DO NOTHING;
