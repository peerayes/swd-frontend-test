"use client";

import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { addPerson, updatePerson, setCurrentPerson } from "@/store/personSlice";
import { PersonFormData, Person } from "@/types/person";
import { RootState } from "@/store/store";
import { th } from "@/locales/th";
import { en } from "@/locales/en";
import dayjs from "dayjs";

// Direct imports - no dynamic imports for simplicity
import PersonForm from "@/components/PersonForm";
import PersonTable from "@/components/PersonTable";
import LanguageSwitch from "@/components/LanguageSwitch";

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { language, currentPerson } = useSelector((state: RootState) => state.person);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use default Thai language on server-side to prevent hydration mismatch
  const t = mounted && language === "en" ? en : th;

  const handleFormSubmit = (formData: PersonFormData) => {
    // Construct citizenId from separate form fields
    const citizenId = [
      formData.citizenId1 || "",
      formData.citizenId2 || "",
      formData.citizenId3 || "",
      formData.citizenId4 || "",
      formData.citizenId5 || "",
    ]
      .filter((part) => part.trim() !== "")
      .join("-");

    const personData: Person = {
      id: editingId || Date.now().toString(),
      title: formData.title || "",
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      birthDate: formData.birthDate || "",
      birthDateDisplay: formData.birthDateDisplay || "",
      age: formData.age,
      nationality: formData.nationality || "",
      citizenId: citizenId,
      gender: formData.gender || "male",
      mobilePhone: {
        countryCode: formData.countryCode || "",
        number: formData.mobilePhone || "",
      },
      passportNo: formData.passportNo,
      expectedSalary: formData.expectedSalary || 0,
      createdAt: editingId ? currentPerson.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    if (editingId) {
      dispatch(updatePerson({ id: editingId, data: personData }));
      setEditingId(undefined);
    } else {
      dispatch(addPerson(personData));
    }
  };

  const handleEdit = (person: Person) => {
    setEditingId(person.id);

    // Parse citizen ID
    const citizenIdParts = person.citizenId.split("-");

    const formData: PersonFormData = {
      title: person.title,
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate,
      birthDateDisplay: person.birthDateDisplay,
      age: person.age,
      nationality: person.nationality,
      citizenId1: citizenIdParts[0],
      citizenId2: citizenIdParts[1],
      citizenId3: citizenIdParts[2],
      citizenId4: citizenIdParts[3],
      citizenId5: citizenIdParts[4],
      gender: person.gender,
      countryCode: person.mobilePhone.countryCode,
      mobilePhone: person.mobilePhone.number,
      passportNo: person.passportNo,
      expectedSalary: person.expectedSalary,
      createdAt: person.createdAt,
    };

    dispatch(setCurrentPerson(formData));
  };



  return (
    <div className="app-container">
        <div className="page-header">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{t.formAndTable}</h1>
          <LanguageSwitch />
        </div>

        <div className="content-wrapper">
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <PersonForm onSubmit={handleFormSubmit} editingId={editingId} />

            <PersonTable onEdit={handleEdit} />
          </div>
        </div>
      </div>
  );
};

export default function Home() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
