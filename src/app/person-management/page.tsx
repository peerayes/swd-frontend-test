"use client";

import { App } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  addPerson,
  setEditingPerson,
  setPagination,
  setPersons,
  updatePerson,
} from "@/store/personSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type {
  FormSubmitHandler,
  Person,
  RegistrationFormValues,
} from "@/types/person.types";

import PersonForm from "@/components/person-management/PersonForm";
import PersonTable from "@/components/person-management/PersonTable";

const PersonManagement = () => {
  const { t } = useTranslation(["person-management", "common"]);
  const { message } = App.useApp();
  const dispatch = useAppDispatch();

  // Redux state
  const persons = useAppSelector((state) => state.persons.persons) as Person[];
  const editingPerson = useAppSelector((state) => state.persons.editingPerson);
  const pagination = useAppSelector((state) => state.persons.pagination);

  // Trigger for table refresh after form submit
  const [triggerTableRefresh, setTriggerTableRefresh] = useState(false);

  // Sort state
  const [sortInfo, setSortInfo] = useState<{
    field: string;
    order: "ascend" | "descend" | null;
  }>({
    field: "",
    order: null,
  });

  // Form handlers with type safety
  const handleFormSubmit: FormSubmitHandler = async (
    values: RegistrationFormValues
  ) => {
    console.log("Form submitted with type safety:", values);

    try {
      if (editingPerson) {
        // Update existing person
        const updatedPerson: Person = {
          ...editingPerson,
          title: values.title,
          name: `${values.title} ${values.firstname} ${values.lastname}`,
          gender: values.gender,
          phone: `${values.countryCode}${values.mobilePhone}`,
          nationality: values.nationality,
          firstname: values.firstname,
          lastname: values.lastname,
          birthday: values.birthday ? values.birthday.toISOString() : "",
          citizenId1: values.citizenId1,
          citizenId2: values.citizenId2,
          citizenId3: values.citizenId3,
          citizenId4: values.citizenId4,
          citizenId5: values.citizenId5,
          countryCode: values.countryCode,
          mobilePhone: values.mobilePhone,
          passportNo: values.passportNo,
          expectedSalary: values.expectedSalary,
        };

        dispatch(updatePerson(updatedPerson));
        dispatch(setEditingPerson(null));
        message.success("อัปเดตข้อมูลสำเร็จ");
      } else {
        // Create new person
        const newPerson: Person = {
          id: Date.now().toString(),
          title: values.title,
          name: `${values.title} ${values.firstname} ${values.lastname}`,
          gender: values.gender,
          phone: `${values.countryCode}${values.mobilePhone}`,
          nationality: values.nationality,
          firstname: values.firstname,
          lastname: values.lastname,
          birthday: values.birthday ? values.birthday.toISOString() : "",
          citizenId1: values.citizenId1,
          citizenId2: values.citizenId2,
          citizenId3: values.citizenId3,
          citizenId4: values.citizenId4,
          citizenId5: values.citizenId5,
          countryCode: values.countryCode,
          mobilePhone: values.mobilePhone,
          passportNo: values.passportNo,
          expectedSalary: values.expectedSalary,
        };

        // Add to persons list via Redux
        dispatch(addPerson(newPerson));
        localStorage.setItem(
          "persons",
          JSON.stringify([...persons, newPerson])
        );

        // Reset pagination to first page when new record is added
        dispatch(
          setPagination({
            current: 1,
            pageSize: pagination.pageSize,
            total: persons.length + 1,
          })
        );

        message.success(t("form.messages.registrationSuccess"));
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      throw error; // Re-throw to let PersonForm handle loading state
    }
  };

  const handleFormReset = () => {
    dispatch(setEditingPerson(null));
    message.info(t("form.messages.resetInfo"));
  };

  const handleCancelEdit = () => {
    dispatch(setEditingPerson(null));
  };

  const handleAfterSubmit = () => {
    // Toggle trigger to refresh table
    setTriggerTableRefresh((prev) => !prev);
  };

  const handleEdit = (person: Person) => {
    dispatch(setEditingPerson(person));
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSortInfo({
      field: sorter.field || "",
      order: sorter.order || null,
    });
  };

  // Sort data based on sortInfo
  const sortedData = useMemo(() => {
    let sortedPersons = [...persons];

    // Default sort: newest first by ID (since ID is timestamp)
    if (!sortInfo.field || !sortInfo.order) {
      return sortedPersons.sort((a: Person, b: Person) =>
        b.id.localeCompare(a.id)
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
    pagination.current * pagination.pageSize
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
        })
      );
    }
  }, [sortedData.length, pagination.current, pagination.pageSize, dispatch]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPersons = localStorage.getItem("persons");
    if (savedPersons) {
      const parsedPersons = JSON.parse(savedPersons);
      dispatch(setPersons(parsedPersons));
    }
  }, [dispatch]);

  // Save to localStorage whenever persons change
  useEffect(() => {
    if (persons.length > 0) {
      localStorage.setItem("persons", JSON.stringify(persons));
    }
  }, [persons]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Person Form Section */}
        <PersonForm
          onSubmit={handleFormSubmit}
          onReset={handleFormReset}
          onCancelEdit={handleCancelEdit}
          onAfterSubmit={handleAfterSubmit}
        />

        {/* Person Table Section */}
        <PersonTable onEdit={handleEdit} triggerRefresh={triggerTableRefresh} />
      </div>
    </div>
  );
};

export default PersonManagement;
