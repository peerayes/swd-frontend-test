'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  deletePerson,
  deleteSelected,
  toggleSelectAll,
  togglePersonSelection,
  setCurrentPage,
  setPageSize,
  setSorting,
  setCurrentPerson
} from '@/store/personSlice';
import { Person } from '@/types/person';
import { th } from '@/locales/th';
import { en } from '@/locales/en';
import type { TableProps, SorterResult } from 'antd';
import dayjs from 'dayjs';

// Direct imports for Ant Design components
import { Table, Button, Checkbox, Space, Popconfirm, message } from 'antd';

interface PersonTableProps {
  onEdit?: (person: Person) => void;
}

const PersonTable: React.FC<PersonTableProps> = ({ onEdit }) => {
  const dispatch = useDispatch();
  const {
    persons,
    selectedIds,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    language
  } = useSelector((state: RootState) => state.person);

  const t = language === 'th' ? th : en;
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort persons with proper typing
  const sortedPersons = [...persons].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortBy === 'name') {
      aValue = `${a.title} ${a.firstName} ${a.lastName}`;
      bValue = `${b.title} ${b.firstName} ${b.lastName}`;
    } else if (sortBy === 'mobilePhone') {
      aValue = `${a.mobilePhone.countryCode} ${a.mobilePhone.number}`;
      bValue = `${b.mobilePhone.countryCode} ${b.mobilePhone.number}`;
    } else {
      // Direct property access with proper typing
      const key = sortBy as keyof Person;
      aValue = a[key];
      bValue = b[key];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPersons = sortedPersons.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      dispatch(deletePerson(id));
      message.success(t.personDeleted);
      setLoading(false);
    }, 500);
  };

  const handleDeleteSelected = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(deleteSelected());
      message.success(t.selectedDeleted);
      setLoading(false);
    }, 500);
  };

  const handleEdit = (person: Person) => {
    if (onEdit) {
      onEdit(person);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    dispatch(toggleSelectAll(checked));
  };

  const handleSelectPerson = (id: string) => {
    dispatch(togglePersonSelection(id));
  };

  const handleTableChange: TableProps<Person>['onChange'] = (pagination, _filters, sorter) => {
    if (pagination.current !== currentPage) {
      dispatch(setCurrentPage(pagination.current));
    }
    if (pagination.pageSize !== pageSize) {
      dispatch(setPageSize(pagination.pageSize));
    }

    if (sorter && (sorter as SorterResult<Person>).field) {
      const typedSorter = sorter as SorterResult<Person>;
      dispatch(setSorting({
        sortBy: typedSorter.field as string,
        sortOrder: typedSorter.order === 'ascend' ? 'asc' : 'desc'
      }));
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedIds.length === persons.length && persons.length > 0}
          indeterminate={selectedIds.length > 0 && selectedIds.length < persons.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      key: 'select',
      width: 60,
      render: (_: never, record: Person) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={() => handleSelectPerson(record.id)}
        />
      ),
    },
    {
      title: t.name,
      key: 'name',
      sorter: true,
      sortOrder: sortBy === 'name' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_: never, record: Person) => (
        <div>
          <div className="font-medium">
            {record.title} {record.firstName} {record.lastName}
          </div>
          {record.age && (
            <div className="text-sm text-gray-500">
              {t.age}: {record.age} {t.yearsOld}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t.gender,
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
      sortOrder: sortBy === 'gender' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (gender: string) => {
        const genderMap = {
          male: t.male,
          female: t.female,
          unsex: t.unsex,
        };
        return genderMap[gender as keyof typeof genderMap] || gender;
      },
    },
    {
      title: t.mobilePhone,
      key: 'mobilePhone',
      sorter: true,
      sortOrder: sortBy === 'mobilePhone' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (_: never, record: Person) => (
        `${record.mobilePhone.countryCode} ${record.mobilePhone.number}`
      ),
    },
    {
      title: t.nationality,
      dataIndex: 'nationality',
      key: 'nationality',
      sorter: true,
      sortOrder: sortBy === 'nationality' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (nationality: string) => {
        const nationalityMap = language === 'th' ? th.nationalities : en.nationalities;
        return nationalityMap[nationality as keyof typeof nationalityMap] || nationality;
      },
    },
    {
      title: t.createdDate || 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (createdAt: string) => (
        dayjs(createdAt).format('DD/MM/YYYY HH:mm')
      ),
    },
    {
      title: t.manage,
      key: 'manage',
      width: 150,
      render: (_: never, record: Person) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.confirmDelete}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              size="small"
              danger
            >
              {t.delete}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-lg">Loading table...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {t.formAndTable} ({persons.length})
        </h2>
        {selectedIds.length > 0 && (
          <Popconfirm
            title={t.confirmDeleteSelected}
            onConfirm={handleDeleteSelected}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              {t.deleteSelected} ({selectedIds.length})
            </Button>
          </Popconfirm>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={paginatedPersons}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: persons.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            language === 'th'
              ? `${range[0]}-${range[1]} จาก ${total} รายการ`
              : `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default PersonTable;
