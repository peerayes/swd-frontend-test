export interface Person {
  id: string;
  title: string; // นาย, นาง, นางสาว
  firstName: string;
  lastName: string;
  birthDate: string; // ISO format
  birthDateDisplay: string; // DD/MM/YYYY or DD/MMBBBB
  age?: number;
  nationality: string;
  citizenId: string; // x-xxxx-xxxxx-xx-x
  gender: 'male' | 'female' | 'unsex';
  mobilePhone: {
    countryCode: string;
    number: string;
  };
  passportNo?: string;
  expectedSalary: number;
  createdAt: string;
}

export interface PersonFormData {
  title?: 'นาย' | 'นาง' | 'นางสาว';
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  birthDateDisplay?: string;
  age?: number;
  nationality?: string;
  citizenId1?: string; // 1 digit
  citizenId2?: string; // 4 digits
  citizenId3?: string; // 5 digits
  citizenId4?: string; // 2 digits
  citizenId5?: string; // 1 digit
  gender?: 'male' | 'female' | 'unsex';
  countryCode?: string; // country code for mobile
  mobilePhone?: string; // phone number
  passportNo?: string;
  expectedSalary?: number;
  citizenId?: string; // full citizenId (combined)
  createdAt?: string;
}

export interface PersonState {
  persons: Person[];
  currentPerson: PersonFormData;
  selectedIds: string[];
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  language: 'th' | 'en';
  loading: boolean;
}

export type PersonAction =
  | { type: 'person/addPerson'; payload: Person }
  | { type: 'person/updatePerson'; payload: { id: string; data: Partial<Person> } }
  | { type: 'person/deletePerson'; payload: string }
  | { type: 'person/deleteSelected' }
  | { type: 'person/toggleSelectAll'; payload: boolean }
  | { type: 'person/togglePersonSelection'; payload: string }
  | { type: 'person/setCurrentPage'; payload: number }
  | { type: 'person/setPageSize'; payload: number }
  | { type: 'person/setSorting'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'person/setLanguage'; payload: 'th' | 'en' }
  | { type: 'person/resetForm' }
  | { type: 'person/setCurrentPerson'; payload: PersonFormData }
  | { type: 'person/loadPersons'; payload: Person[] };
