# Kurdish Cities Clock Component

## Overview

The Kurdish Cities Clock is a specialized component designed to display the time in multiple Kurdish cities across Iraq, Iran, Syria, and Turkey. The component incorporates cultural elements through its color scheme, inspired by the Kurdish flag colors (red, green, yellow, and white).

## Features

- **Multilingual Support**: City and country names are displayed in the user's preferred language
- **Dark Mode**: Full support for dark mode with Kurdish-inspired color schemes
- **Responsive Design**: Automatically adapts to different screen sizes
- **Precise Time Display**: Shows accurate time with proper timezone handling
- **Digital Time Display**: Includes a digital time readout below the analog clock
- **Kurdish Identity**: Incorporates Kurdish flag colors in a subtle, professional way

## Implementation Details

### Components

1. **KurdishCitiesClock**: The main component that renders a single city's clock
2. **KurdishCitiesClockGrid**: A client component that renders a grid of all Kurdish cities
3. **KurdishCitiesPage**: The page component that displays the header and grid

### Color Scheme

The component uses colors inspired by the Kurdish flag:

- **Red** (hour hand): Represents courage and passion
- **Green** (second hand, border): Represents the natural beauty of Kurdistan's landscapes
- **Yellow** (hour markers, center dot): Represents the sun and optimism
- **White** (minute hand): Represents peace and equality

### City Coverage

The component includes major Kurdish cities from four countries:

- **Iraq**: Erbil, Sulaymaniyah, Duhok, Halabja
- **Iran**: Kermanshah, Sanandaj, Mahabad, Ilam
- **Syria**: Qamishli, Kobani, Afrin
- **Turkey**: Diyarbakır, Van, Mardin, Hakkari

## Usage

### Basic Usage

```tsx
import KurdishCitiesClock from '@/components/KurdishCitiesClock';

<KurdishCitiesClock
  city="Erbil"
  country="Iraq"
  timezone="Asia/Baghdad"
  darkMode={false}
  locale="en"
  size="md"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| city | string | - | The name of the city |
| country | string | - | The country the city is located in |
| timezone | string | - | The IANA timezone identifier |
| darkMode | boolean | false | Whether to use dark mode |
| theme | ThemeType | 'elegant' | The theme to use (optional) |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size of the clock |
| locale | string | 'en' | The locale for translations |

## Customization Options

The component can be customized in several ways:

1. **Size**: Choose between small, medium, and large sizes
2. **Dark Mode**: Toggle between light and dark themes
3. **Localization**: Display city names in different languages

## Performance Considerations

- The component uses `useEffect` to update the time every second
- City and country names are localized using a lookup object
- Clock hand positions are calculated using precise mathematical formulas
- The grid automatically adjusts based on screen size

## Accessibility

- The component uses semantic HTML
- Color contrasts meet WCAG AA standards
- Text is properly sized for readability
- Dark mode support for low-light environments

## Related Components

- [ModernAnalogClock](/docs/modern-clock-guide.md)
- [KurdistanClock](/docs/kurdistan-clock-guide.md) 