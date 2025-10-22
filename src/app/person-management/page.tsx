"use client";

import { Button, Card, Form, Input, Modal, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  age: number;
}

const PersonManagement = () => {
  const { t } = useTranslation();
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPersons = localStorage.getItem("persons");
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    }
  }, []);

  // Save to localStorage whenever persons change
  useEffect(() => {
    if (persons.length > 0) {
      localStorage.setItem("persons", JSON.stringify(persons));
    }
  }, [persons]);

  const handleAdd = () => {
    setEditingPerson(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    form.setFieldsValue(person);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this person?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        const updatedPersons = persons.filter((p) => p.id !== id);
        setPersons(updatedPersons);
        localStorage.setItem("persons", JSON.stringify(updatedPersons));
        message.success("Person deleted successfully");
      },
    });
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (editingPerson) {
        // Update existing person
        const updatedPersons = persons.map((p) =>
          p.id === editingPerson.id ? { ...p, ...values } : p,
        );
        setPersons(updatedPersons);
        localStorage.setItem("persons", JSON.stringify(updatedPersons));
        message.success("Person updated successfully");
      } else {
        // Add new person
        const newPerson: Person = {
          id: Date.now().toString(),
          ...values,
        };
        const updatedPersons = [...persons, newPerson];
        setPersons(updatedPersons);
        localStorage.setItem("persons", JSON.stringify(updatedPersons));
        message.success("Person added successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Person, b: Person) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a: Person, b: Person) => a.age - b.age,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Person) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const paginatedData = persons.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize,
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
            ยังคิดชื่อไม่ออก - Person Management
          </h1>
          <Button type="primary" onClick={handleAdd}>
            Add Person
          </Button>
        </div>

        <Card>
          <Table
            dataSource={paginatedData}
            columns={columns}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: persons.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) => {
                setPagination({
                  current: page,
                  pageSize: pageSize || 10,
                  total: persons.length,
                });
              },
            }}
          />
        </Card>

        <Modal
          title={editingPerson ? "Edit Person" : "Add Person"}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          confirmLoading={loading}
          width={600}
        >
          <Form form={form} layout="vertical" initialValues={{ age: 25 }}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input email!" },
                { type: "email", message: "Please enter valid email!" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Please input phone!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter 10-digit phone number!",
                },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please input address!" }]}
            >
              <Input.TextArea placeholder="Enter address" rows={3} />
            </Form.Item>

            <Form.Item
              name="age"
              label="Age"
              rules={[
                { required: true, message: "Please input age!" },
                {
                  type: "number",
                  min: 1,
                  max: 120,
                  message: "Age must be between 1-120!",
                },
              ]}
            >
              <Input type="number" placeholder="Enter age" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PersonManagement;
