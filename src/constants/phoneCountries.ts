export interface PhoneCountry {
  iso: string;
  nameKey: string;
  dialCode: string;
  flag: string;
}

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [
  { iso: 'ML', nameKey: 'mali', dialCode: '+223', flag: '🇲🇱' },
  { iso: 'SN', nameKey: 'senegal', dialCode: '+221', flag: '🇸🇳' },
  { iso: 'CI', nameKey: 'ivoryCoast', dialCode: '+225', flag: '🇨🇮' },
  { iso: 'BF', nameKey: 'burkinaFaso', dialCode: '+226', flag: '🇧🇫' },
  { iso: 'NE', nameKey: 'niger', dialCode: '+227', flag: '🇳🇪' },
  { iso: 'GN', nameKey: 'guinea', dialCode: '+224', flag: '🇬🇳' },
  { iso: 'MR', nameKey: 'mauritania', dialCode: '+222', flag: '🇲🇷' },
  { iso: 'FR', nameKey: 'france', dialCode: '+33', flag: '🇫🇷' },
] as const;

export function findPhoneCountry(dialCode: string): PhoneCountry {
  return (
    PHONE_COUNTRIES.find(country => country.dialCode === dialCode) ??
    PHONE_COUNTRIES[0]
  );
}
