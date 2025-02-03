export type Permission = 'read' | 'write' | 'manage' | 'delete';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: {
    [feature: string]: Permission[];
  };
}

export const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: {
      users: ['read', 'write', 'manage', 'delete'],
      roles: ['read', 'write', 'manage', 'delete'],
      stocks: ['read', 'write', 'manage', 'delete'],
      settings: ['read', 'write', 'manage', 'delete']
    }
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage users and view all stocks',
    permissions: {
      users: ['read', 'manage'],
      roles: ['read'],
      stocks: ['read', 'write'],
      settings: ['read']
    }
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Can view and analyze assigned stocks',
    permissions: {
      stocks: ['read'],
      settings: ['read']
    }
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to assigned stocks',
    permissions: {
      stocks: ['read']
    }
  }
];

export function hasFeaturePermission(
  userRole: Role | undefined,
  feature: string,
  permission: Permission
): boolean {
  if (!userRole) return false;
  return userRole.permissions[feature]?.includes(permission) || false;
}

export function getRoleById(roles: Role[], id: string): Role | undefined {
  return roles.find(role => role.id === id);
}

/**
 * Validates if a role has all required permissions for a feature
 * @param role The role to validate
 * @param feature The feature to check
 * @param requiredPermissions Array of required permissions
 * @returns boolean indicating if all permissions are present
 */
export function hasAllFeaturePermissions(
  role: Role | undefined,
  feature: string,
  requiredPermissions: Permission[]
): boolean {
  if (!role) return false;
  const rolePermissions = role.permissions[feature] || [];
  return requiredPermissions.every(p => rolePermissions.includes(p));
}

// Helper function to check if user can manage roles
export function canManageRoles(role: Role | undefined): boolean {
  return hasFeaturePermission(role, 'roles', 'manage');
}

// Helper function to check if user can manage users
export function canManageUsers(role: Role | undefined): boolean {
  return hasFeaturePermission(role, 'users', 'manage');
}

// Helper function to check if user can view stocks
export function canViewStocks(role: Role | undefined): boolean {
  return hasFeaturePermission(role, 'stocks', 'read');
}

// Helper function to check if user can manage stocks
export function canManageStocks(role: Role | undefined): boolean {
  return hasFeaturePermission(role, 'stocks', 'manage');
}
