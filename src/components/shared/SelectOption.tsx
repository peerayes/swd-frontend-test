import { Select } from "antd";
import { CountryOption } from "@/constants/countryOptions";

/**
 * Renders Select.Option components for country options
 * @param options - Array of country options
 * @param showCountryCode - Whether to show country code in labels
 * @param t - Translation function
 */
export const renderSelectOptions = (
  options: CountryOption[],
  showCountryCode = false,
  t: (key: string) => string,
) => {
  return options.map((option) => (
    <Select.Option key={option.value} value={option.value}>
      <span>
        <span style={{ marginRight: 8 }}>{option.flag}</span>
        {showCountryCode ? (
          <span>
            {option.value} ({t(option.translationKey)})
          </span>
        ) : (
          <span>{t(option.translationKey)}</span>
        )}
      </span>
    </Select.Option>
  ));
};
