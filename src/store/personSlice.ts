import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Person, PersonFormData, PersonState } from '@/types/person';
import dayjs from 'dayjs';

const initialState: PersonState = {
  persons: [],
  currentPerson: {},
  selectedIds: [],
  currentPage: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  language: 'th',
  loading: false,
};

const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<Person>) => {
      state.persons.unshift(action.payload);
      state.selectedIds = [];
    },
    
    updatePerson: (state, action: PayloadAction<{ id: string; data: Partial<Person> }>) => {
      const { id, data } = action.payload;
      const index = state.persons.findIndex(person => person.id === id);
      if (index !== -1) {
        state.persons[index] = { ...state.persons[index], ...data };
      }
    },
    
    deletePerson: (state, action: PayloadAction<string>) => {
      state.persons = state.persons.filter(person => person.id !== action.payload);
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    
    deleteSelected: (state) => {
      state.persons = state.persons.filter(person => !state.selectedIds.includes(person.id));
      state.selectedIds = [];
    },
    
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.selectedIds = state.persons.map(person => person.id);
      } else {
        state.selectedIds = [];
      }
    },
    
    togglePersonSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(selectedId => selectedId !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    
    setLanguage: (state, action: PayloadAction<'th' | 'en'>) => {
      state.language = action.payload;
    },
    
    resetForm: (state) => {
      state.currentPerson = {};
    },
    
    setCurrentPerson: (state, action: PayloadAction<PersonFormData>) => {
      state.currentPerson = action.payload;
    },
    
    setBirthdate: (state, action: PayloadAction<{ date: string; display: string }>) => {
      state.currentPerson.birthDate = action.payload.date;
      state.currentPerson.birthDateDisplay = action.payload.display;
      if (action.payload.date) {
        state.currentPerson.age = dayjs().diff(action.payload.date, 'year');
      }
    },
    
    loadPersons: (state, action: PayloadAction<Person[]>) => {
      state.persons = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addPerson,
  updatePerson,
  deletePerson,
  deleteSelected,
  toggleSelectAll,
  togglePersonSelection,
  setCurrentPage,
  setPageSize,
  setSorting,
  setLanguage,
  resetForm,
  setCurrentPerson,
  setBirthdate,
  loadPersons,
  setLoading,
} = personSlice.actions;

export default personSlice.reducer;