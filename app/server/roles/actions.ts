'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { hasFeaturePermission } from '@/constants/roles'

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

    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
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

    const { data: newRole, error } = await supabase
      .from('roles')
      .insert(roleData)
      .select()
      .single()

    if (error) throw error
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

    const { data: updatedRole, error } = await supabase
      .from('roles')
      .update(roleData)
      .eq('id', roleData.id)
      .select()
      .single()

    if (error) throw error
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

    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting role:', error)
    throw error
  }
}

export async function assignRoles(userId: string, roles: string[]) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    await supabase.from('user_roles').delete().eq('user_id', userId)
    const { error } = await supabase.from('user_roles').insert(
      roles.map(roleId => ({
        user_id: userId,
        role_id: roleId
      }))
    )
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error assigning roles:', error)
    throw error
  }
}

export async function updateStockVisibility(stockId: string, roles: string[]) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    await supabase.from('stock_visibility').delete().eq('stock_id', stockId)
    const { error } = await supabase.from('stock_visibility').insert(
      roles.map(roleId => ({
        stock_id: stockId,
        role_id: roleId
      }))
    )
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating stock visibility:', error)
    throw error
  }
}
