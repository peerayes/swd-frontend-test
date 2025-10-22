import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Person } from "@/types/person.types";

const initialState: Person[] = [];

const personSlice = createSlice({
  name: "persons",
  initialState,
  reducers: {
    addPerson: (state, action: PayloadAction<Person>) => {
      state.push(action.payload);
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      return state.filter((person) => person.id !== action.payload);
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.findIndex(
        (person) => person.id === action.payload.id,
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    setPersons: (state, action: PayloadAction<Person[]>) => {
      return action.payload;
    },
  },
});

export const { addPerson, deletePerson, updatePerson, setPersons } =
  personSlice.actions;
export default personSlice.reducer;
