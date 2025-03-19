# Modern Analog Clock Component Guide

This guide explains how to use and customize the modern analog clock components in the Kurdish Calendar App.

## Overview

The modern clock design provides a sleek, professional alternative to the standard analog clock with:

- Multiple visual themes (Elegant, Minimal, Classic)
- Dark/Light mode support
- Smooth animations
- Responsive design
- Customizable colors and styles

## Components

### ModernAnalogClock

The core component that renders a stylish, animated analog clock.

```tsx
import ModernAnalogClock from '@/components/ModernAnalogClock';

// Basic usage
<ModernAnalogClock timezone="Asia/Tehran" />

// With customization
<ModernAnalogClock 
  timezone="Asia/Baghdad"
  size={220}
  darkMode={true}
  theme="minimal"
  secondHandColor="#FF5252"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timezone` | string | (required) | Time zone identifier (e.g., "Asia/Tehran") |
| `size` | number | 200 | Clock diameter in pixels |
| `hourHandColor` | string | (theme-based) | Color of hour hand |
| `minuteHandColor` | string | (theme-based) | Color of minute hand |
| `secondHandColor` | string | (theme-based) | Color of second hand |
| `faceColor` | string | (theme-based) | Color of clock face |
| `borderColor` | string | (theme-based) | Color of clock border |
| `markersColor` | string | (theme-based) | Color of hour/minute markers |
| `darkMode` | boolean | false | Whether to use dark mode colors |
| `theme` | 'elegant' \| 'minimal' \| 'classic' | 'elegant' | Visual theme to apply |

### ModernCityTime

A complete card component that displays a city name, timezone, analog clock, and digital time.

```tsx
import ModernCityTime from '@/components/ModernCityTime';

// Basic usage
<ModernCityTime 
  city={city} 
  locale="en" 
/>

// With theme customization
<ModernCityTime 
  city={city} 
  locale="ku"
  darkMode={true}
  theme="classic" 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `city` | CityObject | (required) | City object with name and timezone |
| `locale` | string | (required) | Current locale for localization |
| `darkMode` | boolean | false | Whether to use dark mode |
| `theme` | 'elegant' \| 'minimal' \| 'classic' | 'elegant' | Visual theme to apply |

## Themes

### Elegant (Default)
A modern, clean design with a subtle gradient and blue accent colors.

- **Light Mode**: Clean white face with subtle shadow, blue second hand
- **Dark Mode**: Dark gray face with light hands and blue accent

### Minimal
A simplified, flat design with high contrast and minimal decoration.

- **Light Mode**: Light gray face with black hands and red second hand
- **Dark Mode**: Dark gray face with white hands and red accent

### Classic
A traditional clock face inspired by vintage timepieces.

- **Light Mode**: Cream-colored face with numerals and brown accents
- **Dark Mode**: Dark face with white hands and gold accents

## Examples

### Basic Implementation

```tsx
import ModernAnalogClock from '@/components/ModernAnalogClock';

export default function ClockDisplay() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ModernAnalogClock 
        timezone="Asia/Tehran" 
        size={300}
      />
    </div>
  );
}
```

### Theme Switcher

```tsx
import { useState } from 'react';
import ModernAnalogClock from '@/components/ModernAnalogClock';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'elegant' | 'minimal' | 'classic'>('elegant');
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button onClick={() => setTheme('elegant')}>Elegant</button>
        <button onClick={() => setTheme('minimal')}>Minimal</button>
        <button onClick={() => setTheme('classic')}>Classic</button>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      
      <ModernAnalogClock 
        timezone="Asia/Tehran" 
        size={300}
        theme={theme}
        darkMode={darkMode}
      />
    </div>
  );
}
```

## Installation

To use these components in your project:

1. Copy the `ModernAnalogClock.tsx` and `ModernCityTime.tsx` files to your components directory
2. Ensure you have the required dependencies:
   - `@radix-ui/react-tabs` (for the theme switcher tabs)
   - `tailwind-merge` and `clsx` (for class composition)
   - Tailwind CSS for styling

## Performance Considerations

- The clock updates every second, which is efficient for most use cases
- For large numbers of clocks, consider reducing the update frequency
- Use conditional rendering to avoid rendering offscreen clocks

## Accessibility

The clock components include the following accessibility features:

- Color contrast meets WCAG AA standards in both light and dark modes
- Visible time is also provided in text format via the DigitalClock component
- Clock hands have appropriate sizing for visual distinction

## Browser Compatibility

These components are compatible with all modern browsers, including:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

## Dark Mode Implementation

The modern clock design implements a comprehensive dark mode that affects:

1. **Background colors**: The page background and card backgrounds adjust based on dark mode state
2. **Text colors**: All text elements switch to light colors in dark mode
3. **Clock faces**: Clock faces and hands change to dark-appropriate colors
4. **Transitions**: Smooth color transitions when switching modes

### Implementation Details

Dark mode is implemented using Tailwind's dark mode class system. The application:

1. Adds/removes the `dark` class to the HTML element
2. Uses CSS variables to control theme colors
3. Applies specific dark mode styles to UI components
4. Stores user preference in state

```tsx
// Example: Dark mode toggle in ModernClockSettings
const [darkMode, setDarkMode] = useState(false);

// Apply dark mode when state changes
useEffect(() => {
  toggleDarkMode(darkMode);
}, [darkMode]);

// Toggle UI
<Switch 
  id="dark-mode" 
  checked={darkMode}
  onCheckedChange={setDarkMode}
/>
<Label htmlFor="dark-mode">{themeLabels.darkMode}</Label>
```

### Theme Utility Functions

The application uses utility functions from `lib/theme-utils.ts` to manage themes and dark mode:

```tsx
// Toggle dark mode
export function toggleDarkMode(isDarkMode: boolean): void {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    // Apply dark mode classes and styles
    if (isDarkMode) {
      html.classList.add('dark');
      // Apply additional dark mode styling
    } else {
      html.classList.remove('dark');
      // Remove dark mode styling
    }
  }
}

// Get theme colors based on theme and dark mode
export function getThemeColors(theme: ThemeType, darkMode: boolean): {
  // Returns appropriate color schemes based on theme and dark mode
}
``` 