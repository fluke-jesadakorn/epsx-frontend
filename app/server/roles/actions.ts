'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { hasFeaturePermission } from '@/constants/roles'
import { apiClient } from '@/lib/api-client'

export async function getRoles(userId?: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verify admin permissions if userId is provided
    if (userId) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('Unauthorized')
      }

      if (!hasFeaturePermission(user.user_metadata?.role, 'roles', 'read')) {
        throw new Error('Forbidden')
      }
    }

    const roles = await apiClient.get('/roles')
    return roles
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

export async function createRole(roleData: {
  name: string
  description?: string
}, userId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verify admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    if (!hasFeaturePermission(user.user_metadata?.role, 'roles', 'manage')) {
      throw new Error('Forbidden')
    }

    const newRole = await apiClient.post('/roles', roleData)
    return newRole
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

export async function updateRole(roleData: {
  id: string
  name: string
  description?: string
}, userId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verify admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    if (!hasFeaturePermission(user.user_metadata?.role, 'roles', 'manage')) {
      throw new Error('Forbidden')
    }

    const updatedRole = await apiClient.put(`/roles/${roleData.id}`, roleData)
    return updatedRole
  } catch (error) {
    console.error('Error updating role:', error)
    throw error
  }
}

export async function deleteRole(roleId: string, userId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verify admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    if (!hasFeaturePermission(user.user_metadata?.role, 'roles', 'manage')) {
      throw new Error('Forbidden')
    }

    await apiClient.delete(`/roles/${roleId}`)
    return true
  } catch (error) {
    console.error('Error deleting role:', error)
    throw error
  }
}

export async function assignRoles(userId: string, roles: string[]) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    await apiClient.post(`/users/${userId}/roles`, { roles })
    return true
  } catch (error) {
    console.error('Error assigning roles:', error)
    throw error
  }
}

export async function updateStockVisibility(stockId: string, roles: string[]) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    await apiClient.put(`/stocks/${stockId}/visibility`, { roles })
    return true
  } catch (error) {
    console.error('Error updating stock visibility:', error)
    throw error
  }
}
