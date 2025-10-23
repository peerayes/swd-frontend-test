import dayjs, { Dayjs } from "dayjs";

export interface Person {
  id: string;
  title: "นาย" | "นาง" | "นางสาว";
  name: string;
  gender: "male" | "female" | "unsex";
  phone: string;
  nationality: string;
  firstname: string;
  lastname: string;
  birthday: string;
  citizenId1: string;
  citizenId2: string;
  citizenId3: string;
  citizenId4: string;
  citizenId5: string;
  countryCode: string;
  mobilePhone: string;
  passportNo?: string;
  expectedSalary: number;
}

export interface RegistrationFormValues {
  title: "นาย" | "นาง" | "นางสาว";
  firstname: string;
  lastname: string;
  birthday: Dayjs | null; // Dayjs object for form
  nationality: string;
  citizenId1: string;
  citizenId2: string;
  citizenId3: string;
  citizenId4: string;
  citizenId5: string;
  gender: "male" | "female" | "unsex";
  countryCode: string;
  mobilePhone: string;
  passportNo?: string;
  expectedSalary: number;
}
// Helper type for form field validation rules - compatible with Ant Design Rule
export interface FormFieldRule {
  required?: boolean;
  message: string;
  type?:
    | "string"
    | "number"
    | "boolean"
    | "method"
    | "regexp"
    | "integer"
    | "float"
    | "object"
    | "array"
    | "date"
    | "url"
    | "hex"
    | "email";
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  enum?: any[];
  whitespace?: boolean;
}

// Translation function type
type TFunction = (key: string, params?: Record<string, any>) => string;

// Dynamic validation rules generator
export const createValidationRules = (
  t: TFunction,
): Record<keyof RegistrationFormValues, FormFieldRule[]> => ({
  title: [
    {
      required: true,
      message: t("form.validation.required.title"),
    },
  ],
  firstname: [
    {
      required: true,
      message: t("form.validation.required.firstname"),
    },
    {
      min: 2,
      message: t("form.validation.format.firstname.min"),
    },
    {
      pattern: /^[ก-๙a-zA-Z\s]+$/,
      message: t("form.validation.format.firstname.pattern"),
    },
  ],
  lastname: [
    {
      required: true,
      message: t("form.validation.required.lastname"),
    },
    {
      min: 2,
      message: t("form.validation.format.lastname.min"),
    },
    {
      pattern: /^[ก-๙a-zA-Z\s]+$/,
      message: t("form.validation.format.lastname.pattern"),
    },
  ],
  birthday: [
    {
      required: true,
      message: t("form.validation.required.birthday"),
    },
  ],
  nationality: [
    {
      required: true,
      message: t("form.validation.required.nationality"),
    },
  ],
  citizenId1: [
    {
      required: true,
      message: t("form.validation.format.citizenId"),
    },
    {
      pattern: /^[0-9]$/,
      message: t("form.validation.format.citizenId"),
    },
  ],
  citizenId2: [
    {
      pattern: /^[0-9]{4}$/,
      message: "",
    },
  ],
  citizenId3: [
    {
      pattern: /^[0-9]{5}$/,
      message: "",
    },
  ],
  citizenId4: [
    {
      pattern: /^[0-9]{2}$/,
      message: "",
    },
  ],
  citizenId5: [
    {
      pattern: /^[0-9]$/,
      message: "",
    },
  ],
  gender: [
    {
      required: true,
      message: t("form.validation.required.gender"),
    },
  ],
  countryCode: [
    {
      required: true,
      message: t("form.validation.required.countryCode"),
    },
  ],
  mobilePhone: [
    {
      required: true,
      message: t("form.validation.required.mobilePhone"),
    },
    {
      pattern: /^[0-9]{9,10}$/,
      message: t("form.validation.format.mobilePhone"),
    },
  ],
  passportNo: [
    {
      pattern: /^[A-Z0-9]{6,9}$/,
      message: t("form.validation.format.passportNo"),
    },
  ],
  expectedSalary: [
    {
      required: true,
      message: t("form.validation.required.expectedSalary"),
    },
    {
      type: "number",
      min: 0,
      message: t("form.validation.format.expectedSalary"),
    },
  ],
});

// Legacy static validation rules (backward compatibility)
export const FORM_VALIDATION_RULES: Record<
  keyof RegistrationFormValues,
  FormFieldRule[]
> = {
  title: [{ required: true, message: "กรุณาเลือกคำนำหน้าชื่อ!" }],
  firstname: [
    { required: true, message: "กรุณากรอกชื่อ!" },
    { min: 2, message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร!" },
    { pattern: /^[ก-๙a-zA-Z\s]+$/, message: "ชื่อต้องเป็นตัวอักษรเท่านั้น!" },
  ],
  lastname: [
    { required: true, message: "กรุณากรอกนามสกุล!" },
    { min: 2, message: "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร!" },
    {
      pattern: /^[ก-๙a-zA-Z\s]+$/,
      message: "นามสกุลต้องเป็นตัวอักษรเท่านั้น!",
    },
  ],
  birthday: [{ required: true, message: "กรุณาเลือกวันเกิด!" }],
  nationality: [{ required: true, message: "กรุณาเลือกสัญชาติ!" }],
  citizenId1: [
    { required: true, message: "" },
    { pattern: /^[0-9]$/, message: "ต้องเป็นตัวเลข 1 หลัก!" },
  ],
  citizenId2: [
    { required: true, message: "" },
    { pattern: /^[0-9]{4}$/, message: "ต้องเป็นตัวเลข 4 หลัก!" },
  ],
  citizenId3: [
    { required: true, message: "" },
    { pattern: /^[0-9]{5}$/, message: "ต้องเป็นตัวเลข 5 หลัก!" },
  ],
  citizenId4: [
    { required: true, message: "" },
    { pattern: /^[0-9]{2}$/, message: "ต้องเป็นตัวเลข 2 หลัก!" },
  ],
  citizenId5: [
    { required: true, message: "" },
    { pattern: /^[0-9]$/, message: "ต้องเป็นตัวเลข 1 หลัก!" },
  ],
  gender: [{ required: true, message: "กรุณาเลือกเพศ!" }],
  countryCode: [{ required: true, message: "กรุณาเลือกรหัสประเทศ!" }],
  mobilePhone: [
    { required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" },
    {
      pattern: /^[0-9]{9,10}$/,
      message: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก!",
    },
  ],
  passportNo: [
    {
      pattern: /^[A-Z0-9]{6,9}$/,
      message: "หมายเลขพาสปอร์ตต้องเป็นตัวอักษรภาษาอังกฤษและตัวเลข 6-9 ตัว!",
    },
  ],
  expectedSalary: [
    { required: true, message: "กรุณากรอกเงินเดือนที่คาดหวัง!" },
    { type: "number", min: 0, message: "เงินเดือนต้องเป็นตัวเลขที่มากกว่า 0!" },
  ],
};

// Utility types for form handling
export type FormSubmitHandler = (
  values: RegistrationFormValues,
) => void | Promise<void>;
export type FormResetHandler = () => void;

// Form state type
export interface RegistrationFormState {
  loading: boolean;
  submitted: boolean;
  errors: Partial<Record<keyof RegistrationFormValues, string>>;
}

// Select options types
export type TitleOption = {
  value: "นาย" | "นาง" | "นางสาว";
  label: string;
};

export type NationalityOption = {
  value: string;
  label: string;
};

export type CountryCodeOption = {
  value: string;
  label: string;
};

export interface CitizenIdParts {
  part1: string;
  part2: string;
  part3: string;
  part4: string;
  part5: string;
}

// Utility functions for form validation
export const citizenIdValidation = {
  validatePart: (value: string, maxLength: number): boolean => {
    return /^[0-9]+$/.test(value) && value.length <= maxLength;
  },

  combineCitizenId: (parts: CitizenIdParts): string => {
    return `${parts.part1}${parts.part2}${parts.part3}${parts.part4}${parts.part5}`;
  },

  isValidFullCitizenId: (fullId: string): boolean => {
    return /^[0-9]{13}$/.test(fullId);
  },
};

export const DEFAULT_FORM_VALUES: Partial<RegistrationFormValues> = {
  title: "นาย",
  nationality: "thai",
  countryCode: "+66",
  expectedSalary: 0,
};

// Form field labels for i18n
export const FORM_FIELD_LABELS: Record<keyof RegistrationFormValues, string> = {
  title: "Title",
  firstname: "Firstname",
  lastname: "Lastname",
  birthday: "Birthday",
  nationality: "Nationality",
  citizenId1: "Citizen ID",
  citizenId2: "Citizen ID",
  citizenId3: "Citizen ID",
  citizenId4: "Citizen ID",
  citizenId5: "Citizen ID",
  gender: "Gender",
  countryCode: "Country Code",
  mobilePhone: "Mobile Phone",
  passportNo: "Passport No",
  expectedSalary: "Expected Salary",
};
