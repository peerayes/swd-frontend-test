/**
 * Country code options with flags and translations
 * Used in both Country Code and Nationality selects
 */

export interface CountryOption {
  value: string;
  flag: string;
  translationKey: string;
}

// Country code options for phone numbers
export const countryCodeOptions: CountryOption[] = [
  { value: "+66", flag: "🇹🇭", translationKey: "common:countryCodes.thailand" },
  { value: "+1_us", flag: "🇺🇸", translationKey: "common:countryCodes.usa" },
  { value: "+44", flag: "🇬🇧", translationKey: "common:countryCodes.uk" },
  { value: "+81", flag: "🇯🇵", translationKey: "common:countryCodes.japan" },
  { value: "+86", flag: "🇨🇳", translationKey: "common:countryCodes.china" },
  { value: "+60", flag: "🇲🇾", translationKey: "common:countryCodes.malaysia" },
  { value: "+65", flag: "🇸🇬", translationKey: "common:countryCodes.singapore" },
  { value: "+91", flag: "🇮🇳", translationKey: "common:countryCodes.india" },
  { value: "+82", flag: "🇰🇷", translationKey: "common:countryCodes.southKorea" },
  { value: "+33", flag: "🇫🇷", translationKey: "common:countryCodes.france" },
  { value: "+49", flag: "🇩🇪", translationKey: "common:countryCodes.germany" },
  { value: "+61", flag: "🇦🇺", translationKey: "common:countryCodes.australia" },
  { value: "+1_ca", flag: "🇨🇦", translationKey: "common:countryCodes.canada" },
  { value: "+39", flag: "🇮🇹", translationKey: "common:countryCodes.italy" },
  { value: "+34", flag: "🇪🇸", translationKey: "common:countryCodes.spain" },
];

// Nationality options (using ISO 3166-1 alpha-2 codes)
export const nationalityOptions: CountryOption[] = [
  { value: "TH", flag: "🇹🇭", translationKey: "common:countryCodes.thailand" },
  { value: "US", flag: "🇺🇸", translationKey: "common:countryCodes.usa" },
  { value: "GB", flag: "🇬🇧", translationKey: "common:countryCodes.uk" },
  { value: "JP", flag: "🇯🇵", translationKey: "common:countryCodes.japan" },
  { value: "CN", flag: "🇨🇳", translationKey: "common:countryCodes.china" },
  { value: "MY", flag: "🇲🇾", translationKey: "common:countryCodes.malaysia" },
  { value: "SG", flag: "🇸🇬", translationKey: "common:countryCodes.singapore" },
  { value: "IN", flag: "🇮🇳", translationKey: "common:countryCodes.india" },
  { value: "KR", flag: "🇰🇷", translationKey: "common:countryCodes.southKorea" },
  { value: "FR", flag: "🇫🇷", translationKey: "common:countryCodes.france" },
  { value: "DE", flag: "🇩🇪", translationKey: "common:countryCodes.germany" },
  { value: "AU", flag: "🇦🇺", translationKey: "common:countryCodes.australia" },
  { value: "CA", flag: "🇨🇦", translationKey: "common:countryCodes.canada" },
  { value: "IT", flag: "🇮🇹", translationKey: "common:countryCodes.italy" },
  { value: "ES", flag: "🇪🇸", translationKey: "common:countryCodes.spain" },
];
