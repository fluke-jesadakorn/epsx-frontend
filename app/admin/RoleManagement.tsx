'use client'

import { useState, useEffect } from 'react'
import { 
  getRoles,
  createRole,
  assignRoles,
  updateStockVisibility
} from '@/app/server/roles/actions'

interface Role {
  id: string
  name: string
  description?: string
}

interface User {
  id: string
  email: string
  roles: string[]
}

interface StockVisibility {
  stock_id: string
  role_id: string
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stocks, setStocks] = useState<StockVisibility[]>([])

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch roles')
      }
    }
    fetchData()
  }, [])


  const handleAssignRoles = async (userId: string, roles: string[]) => {
    try {
      await assignRoles(userId, roles)
      setUsers(users.map(user => 
        user.id === userId ? { ...user, roles } : user
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign roles')
    }
  }

  const handleUpdateStockVisibility = async (values: {
    stock_id: string
    roles: string[]
  }) => {
    try {
      await updateStockVisibility(values.stock_id, values.roles)
      setStocks([
        ...stocks.filter(s => s.stock_id !== values.stock_id),
        ...values.roles.map(roleId => ({
          stock_id: values.stock_id,
          role_id: roleId
        }))
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stock visibility')
    }
  }

  return (
    <div>
      <h2>Role Management</h2>
      <div>
        {roles.map(role => (
          <div key={role.id}>
            <h3>{role.name}</h3>
            <p>{role.description}</p>
          </div>
        ))}
      </div>

      <h2>User Management</h2>
      <div>
        {users.map(user => (
          <div key={user.id}>
            <p>{user.email}</p>
            <select
              multiple
              value={user.roles}
              onChange={e => handleAssignRoles(user.id, Array.from(e.target.selectedOptions, option => option.value))}
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <h2>Stock Visibility</h2>
      <div>
        {stocks.map(stock => (
          <div key={`${stock.stock_id}-${stock.role_id}`}>
            <p>Stock {stock.stock_id} visible to {roles.find(r => r.id === stock.role_id)?.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
