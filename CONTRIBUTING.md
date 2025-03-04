# Contributing to the Kurdish Calendar App

Thank you for your interest in contributing to the Kurdish Calendar App! This guide will help you get started with contributing to the project.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Exercise consideration and respect in your speech and actions
- Attempt collaboration before conflict
- Refrain from discriminatory or harassing behavior and speech

## How Can I Contribute?

### Reporting Bugs

When reporting bugs, please include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

### Suggesting Features

Feature suggestions are always welcome. Please provide:
- A clear and descriptive title
- Detailed description of the proposed feature
- Explanation of why this feature would be useful
- Examples of how it would be used

### Adding/Updating Holiday Data

The holiday data is stored in `public/data/holidays.json`. To add or update holidays:
1. Follow the existing JSON structure
2. Include translations for all supported languages (en, ku, ar, fa)
3. Verify dates are in the correct format (YYYY-MM-DD)
4. Add relevant notes or quotes if available

## Code Contributions

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/kurdish-calendar.git
   cd kurdish-calendar
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Coding Standards

- Follow the existing code style and conventions
- Use TypeScript types for all new code
- Include JSDoc comments for functions and components
- Ensure your code passes linting:
  ```bash
  npm run lint
  # or
  yarn lint
  ```

### Adding New Calendar Systems

If you want to add support for a new calendar system:

1. Create a new conversion function in the `lib/` directory (e.g., `getNewCalendarDate.ts`)
2. Add appropriate types for the calendar system
3. Add translations for month names in all language files
4. Update the `MultiCalendarDisplay.tsx` component to include the new calendar
5. Add tests for the conversion function

Example structure for a new calendar conversion function:

```typescript
export interface NewCalendarDateResult {
  year: number;
  month: string;
  day: number;
  // Add other relevant fields
}

export function getNewCalendarDate(date: Date = new Date()): NewCalendarDateResult {
  // Conversion logic here
  return {
    year: /* calculated year */,
    month: /* calculated month */,
    day: /* calculated day */
  };
}
```

### Pull Request Process

1. Update your fork to include the latest changes from the main repository
2. Push your changes to your fork
3. Submit a pull request to the main repository
4. Provide a detailed description of your changes
5. Reference any related issues
6. Wait for a maintainer to review your PR
7. Address any requested changes

## Development Workflow

### Testing

We use Jest for testing. To run tests:

```bash
npm run test
# or
yarn test
```

Ensure your code has appropriate test coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

### Linting and Formatting

Run ESLint to check for code quality issues:

```bash
npm run lint
# or
yarn lint
```

Format your code with Prettier:

```bash
npm run format
# or
yarn format
```

### Internationalization (i18n)

When adding new text to the UI:

1. Add the text key and English translation to `public/locale/en/common.json`
2. Add translations for other languages in their respective files:
   - `public/locale/ku/common.json` for Kurdish
   - `public/locale/ar/common.json` for Arabic
   - `public/locale/fa/common.json` for Farsi

3. Use the `useTranslations` hook to access translations in components:
   ```tsx
   const t = useTranslations('common');
   return <div>{t('key')}</div>;
   ```

For nested translation keys, use dot notation:
```tsx
// For accessing nested translations like:
// {
//   "calendar": {
//     "title": "Calendar Title"
//   }
// }
const t = useTranslations('common');
<h1>{t('calendar.title')}</h1>
```

### Documentation

When adding new features or making significant changes:

1. Update relevant documentation in the README.md
2. Add JSDoc comments to new functions and components
3. Include usage examples where appropriate

## Questions?

If you have any questions about contributing, please:
- Open an issue with your question
- Contact the maintainers directly
- Join our community discussions

Thank you for contributing to the Kurdish Calendar App! 