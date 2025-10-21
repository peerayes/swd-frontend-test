import { configureStore, Middleware } from '@reduxjs/toolkit';
import personReducer from './personSlice';
import { PersonState } from './personSlice';

const localStorageMiddleware: Middleware<{}, { person: PersonState }, any> = (store) => (next) => (action) => {
  const result = next(action);

  // Save to localStorage หลังจาก action เสร็จ
  if (action.type.startsWith('person/') && typeof window !== 'undefined') {
    const state = store.getState();
    try {
      localStorage.setItem('persons', JSON.stringify(state.person.persons));
      localStorage.setItem('personSettings', JSON.stringify({
        language: state.person.language,
        pageSize: state.person.pageSize,
        sortBy: state.person.sortBy,
        sortOrder: state.person.sortOrder,
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  return result;
};

// Load data from localStorage
const loadFromLocalStorage = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      persons: [],
      settings: {
        language: 'th',
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    };
  }

  try {
    const persons = localStorage.getItem('persons');
    const settings = localStorage.getItem('personSettings');

    return {
      persons: persons ? JSON.parse(persons) : [],
      settings: settings ? JSON.parse(settings) : {
        language: 'th',
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    };
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return {
      persons: [],
      settings: {
        language: 'th',
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    };
  }
};

const { persons, settings } = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    person: personReducer,
  },
  preloadedState: {
    person: {
      persons,
      currentPerson: {},
      selectedIds: [],
      currentPage: 1,
      pageSize: settings.pageSize,
      sortBy: settings.sortBy,
      sortOrder: settings.sortOrder,
      language: settings.language,
      loading: false,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
