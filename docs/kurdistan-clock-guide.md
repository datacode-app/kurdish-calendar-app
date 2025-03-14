# Kurdistan Clock Component Guide

## Overview

The Kurdistan Clock component is a modern, culturally-inspired analog clock designed specifically for the Kurdish Calendar App. It features a clean, minimalist design with subtle elements inspired by Kurdish identity.

![Kurdistan Clock](../public/kurdistan-clock-preview.png)

## Key Features

- **Kurdish-inspired Design**: The clock incorporates colors from the Kurdish flag (red, green, white, and yellow) in an elegant, tasteful manner
- **Minimalist & Clean**: Prioritizes simplicity with clear hour and minute markers
- **Unified Design**: A single, consistent design that works across all cities
- **Dark Mode Support**: Full dark mode compatibility with optimized colors
- **Responsive**: Adapts beautifully to different screen sizes
- **Localization Support**: Displays city names in Kurdish, Arabic, Persian, or English based on locale

## Component Structure

The Kurdistan Clock system consists of two main components:

1. **KurdistanClock**: The core clock component with Kurdish-inspired design
2. **KurdistanClockClient**: A client component for handling interactive elements

## Usage

### Basic Implementation

```tsx
import KurdistanClock from '@/components/KurdistanClock';

// Basic usage
<KurdistanClock
  cityName="هەولێر"
  timezone="Asia/Baghdad"
  country="Iraq"
/>

// With customization
<KurdistanClock
  cityName="هەولێر"
  timezone="Asia/Baghdad"
  country="Iraq"
  darkMode={true}
  size="lg"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cityName` | string | (required) | Name of the city to display |
| `timezone` | string | (required) | Time zone identifier (e.g., "Asia/Baghdad") |
| `country` | string | (required) | Country name |
| `darkMode` | boolean | false | Whether to use dark mode colors |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the clock |

## Design Elements

### Color Palette

The design uses colors inspired by the Kurdish flag:

- **Red**: Used for the clock border and hour markers, symbolizing the blood of Kurdish martyrs
- **Green**: Used for the minute hand, representing the landscapes of Kurdistan
- **Yellow/Gold**: Used for the second hand and center dot, representing the Kurdish sun emblem
- **White/Gray**: Used for the dial background, symbolizing peace and equality

### Dark Mode

In dark mode, the colors adjust to maintain visibility while preserving the Kurdish identity:

- The background shifts to dark gray
- The hands and markers use lighter versions of the Kurdish flag colors
- The sun-inspired decoration becomes more subtle but remains visible

### Size Variations

The clock is available in three sizes:

- **Small (sm)**: 36px × 36px, suitable for compact layouts
- **Medium (md)**: 52px × 52px, the default size
- **Large (lg)**: 72px × 72px, for prominent display

## Implementation Details

### Clock Hands

The clock features three distinct hands:

- **Hour Hand**: Thicker, shorter, colored in red
- **Minute Hand**: Medium thickness, medium length, colored in green
- **Second Hand**: Thin, longest, colored in yellow with smooth animation

### Special Features

- **Sun Decoration**: A subtle, blurred circular element behind the clock face, inspired by the sun in the Kurdish flag
- **Smooth Animations**: The second hand moves with a smooth transition
- **Digital Time**: Clear digital time display under the analog clock

## Integration Guide

To integrate the Kurdistan Clock into your app:

1. Copy the `KurdistanClock.tsx` component to your project
2. Ensure you have the necessary dependencies (React, Tailwind CSS)
3. Use the component with appropriate props for each city
4. For interactive controls like dark mode, use the pattern shown in `kurdistan-clock-client.tsx`

## Accessibility Considerations

- **Color Contrast**: All elements maintain WCAG AA compliant contrast in both light and dark modes
- **Text Readability**: City names and times use appropriate font sizes and weights
- **Digital Alternative**: The digital time provides an alternative for those who have difficulty reading analog clocks

## Performance Optimization

- The clock updates every second, which is efficient for most use cases
- For large numbers of clocks, consider:
  - Reducing the update frequency
  - Using conditional rendering for offscreen clocks
  - Implementing virtualization for long lists

## Credits

Designed and implemented for the Kurdish Calendar App, with inspiration from Kurdish cultural elements and modern design principles. 