# Kurdish Calendar App

![Kurdish Calendar Banner](public/images/banner.png)

A comprehensive calendar application that supports multiple calendar systems relevant to Kurdish communities and the broader Middle East region. This application is available at [kurd.dev](https://kurd.dev).

## ✨ Features

- **Multi-Calendar System Support**:
  - Gregorian (Western) Calendar
  - Jalali/Persian (Solar Hijri) Calendar
  - Hijri (Islamic/Lunar) Calendar
  - Kurdish Calendar with both Rojhalat (Eastern) and Bashur (Southern) variants

- **Multi-Language Interface**:
  - Kurdish (Sorani)
  - English
  - Arabic
  - Farsi (Persian)

- **Holidays & Cultural Events**:
  - Cultural and religious holidays
  - National commemorations
  - Historical events

- **Modern UI**:
  - Responsive design for all devices
  - Theme customization
  - Accessible interface

## 🖥️ Tech Stack

- [Next.js](https://nextjs.org/) v15 with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [next-intl](https://next-intl-docs.vercel.app/) for internationalization
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [moment-jalali](https://github.com/jalaali/moment-jalaali) for Persian calendar
- [moment-hijri](https://github.com/moment/moment-hijri) for Hijri calendar

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.17 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kurdish-calendar.git
   cd kurdish-calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Calendar Navigation

- Use the arrow buttons to navigate between months
- Click on any date to view events for that day
- Use the language selector to switch between supported languages

### Kurdish Calendar Options

When using the Kurdish language interface, you can choose between two Kurdish calendar systems:

- **Rojhalat (Eastern)**: Based on Persian/Solar Hijri calendar
- **Bashur (Southern)**: Based on Gregorian calendar with Kurdish month names

### Viewing Events

- Events for the selected date appear in the "Events of the Day" section
- Browse monthly events in the "Events This Month" section

## 🛠️ Project Structure

```
kurdish-calendar/
├── app/                   # App Router pages and layouts
│   ├── [locale]/          # Dynamic routes for multilingual support
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # Base UI components
│   └── ...                # Feature-specific components
├── lib/                   # Utility functions and helpers
│   ├── date-utils.ts      # Date manipulation utilities
│   ├── getKurdishDate.ts  # Kurdish date calculation
│   └── jalaali.ts         # Jalali calendar utilities
├── public/                # Static assets and data
│   ├── data/              # JSON data files
│   │   └── holidays.json  # Holiday and event data
│   ├── locale/            # Translation files
│   │   ├── en/            # English translations
│   │   │   └── common.json
│   │   ├── ku/            # Kurdish translations
│   │   │   └── common.json
│   │   ├── ar/            # Arabic translations
│   │   │   └── common.json
│   │   └── fa/            # Farsi translations
│   │       └── common.json
│   └── images/            # Static images
└── styles/                # Global styles
```

## 📊 Data Management

Holiday and event data is stored in `public/data/holidays.json`. Each event includes:

- Date in ISO format
- Event name in multiple languages
- Optional notes and quotes
- Associated country or region

Example:
```json
{
  "date": "2024-03-21",
  "event": {
    "en": "Newroz - Kurdish New Year",
    "ku": "نەورۆز - سەری ساڵی کوردی",
    "ar": "نوروز - رأس السنة الكردية",
    "fa": "نوروز - سال نو کردی"
  },
  "country": "Kurdistan"
}
```

## 🌐 Internationalization

The application uses next-intl for internationalization. Translation files are stored in the `public/locale/[lang]/common.json` directories:

```typescript
// Example usage in components
const t = useTranslations('common');
<h3>{t('calendar.multiCalendar.kurdishRojhalat')}</h3>
```

Example from `public/locale/ku/common.json`:
```json
{
  "calendar": {
    "title": "ڕۆژمێری کوردی",
    "today": "ئەمڕۆ",
    "multiCalendar": {
      "title": "ڕۆژمێرەکان",
      "gregorian": "ڕۆژمێری زایینی",
      "jalali": "ڕۆژمێری هەتاوی",
      "hijri": "ڕۆژمێری کۆچی مانگی",
      "kurdishRojhalat": "ڕۆژمێری کوردی ڕۆژهەڵات",
      "kurdishBashur": "ڕۆژمێری کوردی باشوور"
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md) for guidelines on how to proceed.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Thanks to all contributors who have helped build this project
- Special thanks to the Kurdish community for their support and feedback
- Calendar conversion algorithms adapted from various open-source projects

## 📞 Contact

For questions, feedback, or support, please [open an issue](https://github.com/datacode-app/kurdish-calendar/issues) or contact the maintainers directly.

---

Made with ❤️ for the Kurdish community
