export interface MultiLanguageText {
  en: string;
  ku: string;
  ar: string;
  fa: string;
}

export interface Quote {
  celebrity: string;
  quote: MultiLanguageText;
}

export interface Holiday {
  date: string;
  event: MultiLanguageText;
  note?: MultiLanguageText;
  country?: string;
  region?: string;
  quote?: Quote;
} 