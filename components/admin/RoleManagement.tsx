'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button, Table, Modal, Form, Input, Select, message, Tabs } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: {
    [key: string]: string[];
  };
}

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface StockVisibility {
  stock_id: string;
  role_id: string;
}

export function RoleManagement() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stocks, setStocks] = useState<StockVisibility[]>([]);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [roleForm] = Form.useForm();
  const [stockForm] = Form.useForm();

  // Fetch all data
  const fetchData = async () => {
    const { data: rolesData } = await supabase.from('roles').select('*');
    const { data: usersData } = await supabase
      .from('users')
      .select('id, email, user_roles(role_id)');
    const { data: stocksData } = await supabase.from('stock_visibility').select('*');

    if (rolesData) {
      setRoles(rolesData);
    }

    if (usersData) {
      setUsers(usersData.map((user: { id: string; email: string; user_roles: { role_id: string }[] }) => ({
        ...user,
        roles: user.user_roles.map((ur) => ur.role_id)
      })));
    }

    if (stocksData) {
      setStocks(stocksData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Role Management
  const handleCreateRole = async (values: Role) => {
    try {
      const { error } = await supabase.from('roles').insert([values]);
      if (error) throw error;
      message.success('Role created successfully');
      setIsRoleModalVisible(false);
      roleForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to create role');
    }
  };

  const handleAssignRoles = async (userId: string, roles: string[]) => {
    try {
      // Remove existing roles
      await supabase.from('user_roles').delete().eq('user_id', userId);
      
      // Add new roles
      const { error } = await supabase.from('user_roles').insert(
        roles.map(roleId => ({
          user_id: userId,
          role_id: roleId
        }))
      );
      
      if (error) throw error;
      message.success('Roles updated successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to update roles');
    }
  };

  // Stock Visibility Management
  const handleUpdateStockVisibility = async (values: { stock_id: string, roles: string[] }) => {
    try {
      // Remove existing visibility
      await supabase.from('stock_visibility').delete().eq('stock_id', values.stock_id);
      
      // Add new visibility
      const { error } = await supabase.from('stock_visibility').insert(
        values.roles.map(roleId => ({
          stock_id: values.stock_id,
          role_id: roleId
        }))
      );
      
      if (error) throw error;
      message.success('Stock visibility updated successfully');
      setIsStockModalVisible(false);
      stockForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to update stock visibility');
    }
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Roles" key="roles">
          <div className="mb-4">
            <Button type="primary" onClick={() => setIsRoleModalVisible(true)}>
              Create New Role
            </Button>
          </div>

          <Table
            dataSource={roles}
            columns={[
              { title: 'ID', dataIndex: 'id', key: 'id' },
              { title: 'Name', dataIndex: 'name', key: 'name' },
              { title: 'Description', dataIndex: 'description', key: 'description' },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Button type="link" onClick={() => {
                    roleForm.setFieldsValue(record);
                    setIsRoleModalVisible(true);
                  }}>
                    Edit
                  </Button>
                ),
              },
            ]}
            rowKey="id"
          />
        </TabPane>

        <TabPane tab="Users" key="users">
          <Table
            dataSource={users}
            columns={[
              { title: 'Email', dataIndex: 'email', key: 'email' },
              {
                title: 'Roles',
                key: 'roles',
                render: (_, record) => (
                  <Select
                    mode="multiple"
                    value={record.roles}
                    onChange={(values) => handleAssignRoles(record.id, values)}
                    style={{ width: '100%' }}
                  >
                    {roles.map(role => (
                      <Option key={role.id} value={role.id}>
                        {role.name}
                      </Option>
                    ))}
                  </Select>
                ),
              },
            ]}
            rowKey="id"
          />
        </TabPane>

        <TabPane tab="Stock Visibility" key="stocks">
          <div className="mb-4">
            <Button type="primary" onClick={() => setIsStockModalVisible(true)}>
              Configure Stock Visibility
            </Button>
          </div>

          <Table
            dataSource={stocks}
            columns={[
              { title: 'Stock ID', dataIndex: 'stock_id', key: 'stock_id' },
              {
                title: 'Visible to Roles',
                key: 'roles',
                render: (_, record) => (
                  <span>
                    {roles.find(r => r.id === record.role_id)?.name}
                  </span>
                ),
              },
            ]}
            rowKey="stock_id"
          />
        </TabPane>
      </Tabs>

      {/* Role Modal */}
      <Modal
        title="Manage Role"
        visible={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={() => roleForm.submit()}
      >
        <Form form={roleForm} onFinish={handleCreateRole}>
          <Form.Item label="ID" name="id" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Stock Visibility Modal */}
      <Modal
        title="Configure Stock Visibility"
        visible={isStockModalVisible}
        onCancel={() => setIsStockModalVisible(false)}
        onOk={() => stockForm.submit()}
      >
        <Form form={stockForm} onFinish={handleUpdateStockVisibility}>
          <Form.Item
            label="Stock ID"
            name="stock_id"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Visible to Roles"
            name="roles"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
