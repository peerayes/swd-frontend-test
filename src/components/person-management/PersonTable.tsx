"use client";

import { App, Button, Card, Popconfirm, Space, Spin, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
  deletePerson,
  setPagination,
  setSelectedRowKeys,
} from "@/store/personSlice";
import { useAppSelector } from "@/store/store";
import type { Person } from "@/types/person.types";

interface PersonTableProps {
  onEdit: (person: Person) => void;
  externalLoading?: boolean;
  onAfterDelete?: () => Promise<void>;
  recentlyUpdatedId?: string | null;
}

const PersonTable = ({
  onEdit,
  externalLoading = false,
  onAfterDelete,
  recentlyUpdatedId,
}: PersonTableProps) => {
  const { t } = useTranslation(["person-management", "common"]);
  const { message } = App.useApp();
  const dispatch = useDispatch();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Sort state
  const [sortInfo, setSortInfo] = useState<{
    field: string;
    order: "ascend" | "descend" | null;
  }>({
    field: "",
    order: null,
  });

  // Redux state
  const persons = useAppSelector((state) => state.persons.persons) as Person[];
  const selectedRowKeys = useAppSelector(
    (state) => state.persons.selectedRowKeys,
  );
  const pagination = useAppSelector((state) => state.persons.pagination);

  // Initialize table on mount - Show initial loading to prevent UI flash
  useEffect(() => {
    // Set a minimal delay to prevent flash of content
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deletePerson(id));
      message.success(t("table.messages.deleteSuccess"));

      // Trigger parent loading
      if (onAfterDelete) {
        await onAfterDelete();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t("table.messages.noSelection"));
      return;
    }

    try {
      selectedRowKeys.forEach((id) => {
        dispatch(deletePerson(id as string));
      });
      const deletedCount = selectedRowKeys.length;
      dispatch(setSelectedRowKeys([]));

      message.success(
        t("table.messages.deleteSelected", { count: deletedCount }),
      );

      // Trigger parent loading
      if (onAfterDelete) {
        await onAfterDelete();
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูลที่เลือก");
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    dispatch(
      setSelectedRowKeys(newSelectedRowKeys.map((key) => key.toString())),
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: t("table.columns.name"),
      key: "fullname",
      width: 200,
      sorter: (a: Person, b: Person) => {
        const nameA = `${a.firstname} ${a.lastname}`;
        const nameB = `${b.firstname} ${b.lastname}`;
        return nameA.localeCompare(nameB, "th");
      },
      sortOrder: sortInfo.field === "fullname" ? sortInfo.order : null,
      render: (name: string, record: Person) => (
        <div>
          <div className="font-medium">
            {record.firstname} {record.lastname}
          </div>
        </div>
      ),
    },
    {
      title: t("table.columns.gender"),
      dataIndex: "gender",
      key: "gender",
      width: 100,
      sorter: (a: Person, b: Person) => a.gender.localeCompare(b.gender, "th"),
      sortOrder: sortInfo.field === "gender" ? sortInfo.order : null,
      render: (gender: string) => (
        <span style={{ textTransform: "capitalize" }}>
          {gender === "male"
            ? t("form.fields.gender.options.male")
            : gender === "female"
              ? t("form.fields.gender.options.female")
              : t("form.fields.gender.options.unsex")}
        </span>
      ),
    },
    {
      title: t("table.columns.phone"),
      dataIndex: "phone",
      key: "phone",
      width: 150,
      sorter: (a: Person, b: Person) => a.phone.localeCompare(b.phone, "th"),
      sortOrder: sortInfo.field === "phone" ? sortInfo.order : null,
    },
    {
      title: t("table.columns.nationality"),
      dataIndex: "nationality",
      key: "nationality",
      width: 120,
      sorter: (a: Person, b: Person) =>
        a.nationality.localeCompare(b.nationality, "th"),
      sortOrder: sortInfo.field === "nationality" ? sortInfo.order : null,
      render: (nationality: string) => (
        <span style={{ textTransform: "capitalize" }}>
          {nationality === "thai"
            ? t("form.fields.nationality.options.thai")
            : nationality}
        </span>
      ),
    },
    {
      title: t("table.columns.actions"),
      key: "actions",
      width: 150,
      render: (_: unknown, record: Person) => (
        <Space key={`actions-${record.id}`}>
          <Button
            type="primary"
            size="small"
            onClick={() => onEdit(record)}
            disabled={externalLoading}
          >
            {t("table.actions.edit")}
          </Button>
          <Popconfirm
            title={t("table.confirm.delete.title")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("ok", { ns: "common" })}
            cancelText={t("cancel", { ns: "common" })}
          >
            <Button
              type="primary"
              danger
              size="small"
              disabled={externalLoading}
            >
              {t("table.actions.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Sort data based on sortInfo
  const sortedData = useMemo(() => {
    let sortedPersons = [...persons];

    // Default sort: newest first by ID (since ID is timestamp)
    if (!sortInfo.field || !sortInfo.order) {
      return sortedPersons.sort((a: Person, b: Person) =>
        b.id.localeCompare(a.id),
      );
    }

    return sortedPersons.sort((a: Person, b: Person) => {
      let compareResult = 0;

      switch (sortInfo.field) {
        case "fullname":
          const nameA = `${a.firstname} ${a.lastname}`;
          const nameB = `${b.firstname} ${b.lastname}`;
          compareResult = nameA.localeCompare(nameB, "th");
          break;
        case "gender":
          compareResult = a.gender.localeCompare(b.gender, "th");
          break;
        case "phone":
          compareResult = a.phone.localeCompare(b.phone, "th");
          break;
        case "nationality":
          compareResult = a.nationality.localeCompare(b.nationality, "th");
          break;
        default:
          return 0;
      }

      return sortInfo.order === "ascend" ? compareResult : -compareResult;
    });
  }, [persons, sortInfo]);

  const paginatedData = sortedData.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize,
  );

  // Auto-navigate to correct page when data changes
  useEffect(() => {
    const totalPages = Math.ceil(sortedData.length / pagination.pageSize);
    const currentPage = pagination.current;

    // If current page is beyond total pages, go to last page
    if (currentPage > totalPages && totalPages > 0) {
      dispatch(
        setPagination({
          current: totalPages,
          pageSize: pagination.pageSize,
          total: sortedData.length,
        }),
      );
    }
  }, [sortedData.length, pagination.current, pagination.pageSize, dispatch]);

  // Show loading when initial load or external trigger
  const showLoading = isLoading || externalLoading;

  if (showLoading) {
    return (
      <Card>
        <div
          className="flex flex-col justify-center items-center"
          style={{ height: "400px" }}
        >
          <Spin size="large" />
          <div className="mt-4 text-gray-600">
            {isLoading ? "กำลังโหลดข้อมูลตาราง..." : "กำลังอัปเดตข้อมูล..."}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <style>{`
        .recently-updated-row {
          background-color: #fff5f5 !important;
          transition: background-color 0.3s ease;
        }
        .recently-updated-row:hover {
          background-color: #fff5f5 !important;
        }
      `}</style>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Popconfirm
            title={t("table.confirm.deleteSelected.title", {
              count: selectedRowKeys.length,
            })}
            onConfirm={handleDeleteSelected}
            okText={t("ok", { ns: "common" })}
            cancelText={t("cancel", { ns: "common" })}
            disabled={selectedRowKeys.length === 0 || externalLoading}
          >
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length === 0 || externalLoading}
            >
              {t("table.actions.deleteSelected", {
                count: selectedRowKeys.length,
              })}
            </Button>
          </Popconfirm>
        </Space>
      </div>
      <Table
        dataSource={paginatedData}
        columns={columns}
        rowKey="id"
        rowSelection={rowSelection}
        rowClassName={(record) =>
          record.id === recentlyUpdatedId ? "recently-updated-row" : ""
        }
        onChange={(paginationInfo, filters, sorter) => {
          const sorterInfo = Array.isArray(sorter) ? sorter[0] : sorter;
          setSortInfo({
            field: (sorterInfo.field as string) || "",
            order: sorterInfo.order as "ascend" | "descend" | null,
          });

          // Dispatch pagination changes to Redux
          dispatch(
            setPagination({
              current: paginationInfo.current,
              pageSize: paginationInfo.pageSize,
              total: sortedData.length,
            }),
          );
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: sortedData.length,
          showSizeChanger: true,
          showTotal: (total: number, range: [number, number]) =>
            t("table.pagination.total", {
              start: range[0],
              end: range[1],
              total,
            }),
          pageSizeOptions: ["5", "10", "20", "50"],
          onShowSizeChange: (current, size) => {
            dispatch(
              setPagination({
                current: current,
                pageSize: size,
                total: sortedData.length,
              }),
            );
          },
        }}
      />
    </Card>
  );
};

export default PersonTable;
