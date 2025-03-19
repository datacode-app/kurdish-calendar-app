# Documentation Updates

This document summarizes the updates made to improve the documentation and code structure of the Kurdish Calendar App.

## Updated Files

### 1. Documentation Files

- **README.md**: Updated with improved project structure information and internationalization details
- **CONTRIBUTING.md**: Updated with correct paths for locale files and improved internationalization guidelines
- **LICENSE**: MIT license file verified and confirmed

### 2. Code Documentation

- **lib/utils.ts**: Added comprehensive JSDoc comments for the utility functions
- **lib/getKurdishDate.ts**: Added detailed documentation for Kurdish date calculations
- **lib/date-utils.ts**: Improved documentation and updated locale file paths
- **lib/jalaali.ts**: Added documentation for the Jalaali calendar conversion functions
- **app/components/MultiCalendarDisplay.tsx**: Added component and function documentation and updated translation namespaces

## Internationalization Updates

### Path Structure

Updated all references to use the correct locale file structure:

```
public/locale/
├── en/             # English translations
│   └── common.json
├── ku/             # Kurdish translations
│   └── common.json
├── ar/             # Arabic translations
│   └── common.json
└── fa/             # Farsi translations
    └── common.json
```

### Translation Access Pattern

Updated the translation access pattern in components:

```typescript
// Import useTranslations hook
import { useTranslations } from 'next-intl';

// In component:
const t = useTranslations('common');

// Access nested translations with dot notation
<h1>{t('calendar.title')}</h1>
<p>{t('calendar.multiCalendar.gregorian')}</p>
```

## Next Steps

1. **Review Additional Components**: Consider reviewing and updating more components for consistent translation usage
2. **Update Tests**: Ensure any tests are updated to match the new locale file structure
3. **Translation Key Structure**: Consider standardizing the translation key hierarchy across the application
4. **Documentation Expansion**: Further expand documentation for more complex components as needed 