import type { Person } from "@/types/person.types";

// Storage key constants
export const STORAGE_KEYS = {
  PERSONS: "persons",
  LANGUAGE: "language",
} as const;

// Person storage utilities
export const personStorage = {
  /**
   * Load persons from localStorage
   * @returns Array of persons or empty array
   */
  loadPersons(): Person[] {
    try {
      if (typeof window === "undefined") return [];

      const savedPersons = localStorage.getItem(STORAGE_KEYS.PERSONS);
      if (!savedPersons) return [];

      const parsedPersons = JSON.parse(savedPersons);
      return Array.isArray(parsedPersons) ? parsedPersons : [];
    } catch (error) {
      console.error("Error loading persons from localStorage:", error);
      return [];
    }
  },

  /**
   * Save persons to localStorage
   * @param persons Array of persons to save
   */
  savePersons(persons: Person[]): void {
    try {
      if (typeof window === "undefined") return;

      localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
    } catch (error) {
      console.error("Error saving persons to localStorage:", error);
    }
  },

  /**
   * Clear all persons from localStorage
   */
  clearPersons(): void {
    try {
      if (typeof window === "undefined") return;

      localStorage.removeItem(STORAGE_KEYS.PERSONS);
    } catch (error) {
      console.error("Error clearing persons from localStorage:", error);
    }
  },

  /**
   * Check if persons exist in localStorage
   * @returns boolean indicating if persons exist
   */
  hasPersons(): boolean {
    try {
      if (typeof window === "undefined") return false;

      const savedPersons = localStorage.getItem(STORAGE_KEYS.PERSONS);
      return !!savedPersons && savedPersons !== "[]";
    } catch (error) {
      console.error("Error checking persons in localStorage:", error);
      return false;
    }
  },
};
