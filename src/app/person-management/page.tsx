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

  // Table loading trigger
  const [tableLoading, setTableLoading] = useState(false);

  // Recently updated row ID for highlight effect
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | null>(null);

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

        // Set highlighted row for 3 seconds
        setRecentlyUpdatedId(updatedPerson.id);
        setTimeout(() => {
          setRecentlyUpdatedId(null);
        }, 3000);

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

  const handleCancelEdit = () => {
    dispatch(setEditingPerson(null));
  };

  const handleEdit = (person: Person) => {
    dispatch(setEditingPerson(person));
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAfterSubmit = async () => {
    // Show table loading
    setTableLoading(true);
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300));
    setTableLoading(false);
  };

  const handleAfterDelete = async () => {
    // Show table loading
    setTableLoading(true);
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300));
    setTableLoading(false);
  };

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
          onCancelEdit={handleCancelEdit}
          onAfterSubmit={handleAfterSubmit}
        />

        {/* Person Table Section */}
        <PersonTable
          onEdit={handleEdit}
          externalLoading={tableLoading}
          onAfterDelete={handleAfterDelete}
          recentlyUpdatedId={recentlyUpdatedId}
        />
      </div>
    </div>
  );
};

export default PersonManagement;
