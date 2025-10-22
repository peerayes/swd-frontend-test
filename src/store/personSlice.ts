import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Person } from "@/types/person.types";

interface PersonState {
  persons: Person[];
  editingPerson: Person | null;
  selectedRowKeys: string[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

const initialState: PersonState = {
  persons: [],
  editingPerson: null,
  selectedRowKeys: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

const personSlice = createSlice({
  name: "persons",
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<Person>) => {
      state.persons.push(action.payload);
      state.pagination.total = state.persons.length;
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.persons = state.persons.filter(
        (person) => person.id !== action.payload,
      );
      state.pagination.total = state.persons.length;
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.persons.findIndex(
        (person) => person.id === action.payload.id,
      );
      if (index !== -1) {
        state.persons[index] = action.payload;
      }
    },
    setPersons: (state, action: PayloadAction<Person[]>) => {
      state.persons = action.payload;
      state.pagination.total = action.payload.length;
    },
    setEditingPerson: (state, action: PayloadAction<Person | null>) => {
      state.editingPerson = action.payload;
    },
    setSelectedRowKeys: (state, action: PayloadAction<string[]>) => {
      state.selectedRowKeys = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<PersonState["pagination"]>>,
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const {
  addPerson,
  deletePerson,
  updatePerson,
  setPersons,
  setEditingPerson,
  setSelectedRowKeys,
  setPagination,
} = personSlice.actions;
export default personSlice.reducer;
