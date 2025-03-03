# Kurdish Calendar App

A modern, multilingual Kurdish calendar application built with Next.js 15, TypeScript, and Tailwind CSS. This application provides a beautiful interface for viewing Kurdish holidays and events.

## Features

- **Multilingual Support**: Available in Kurdish, Arabic, Persian, and English
- **Interactive Calendar**: View and navigate through months with holiday highlights
- **Event Details**: See detailed information about holidays and events
- **Responsive Design**: Works on all devices from mobile to desktop
- **Modern UI**: Clean, minimalist design with dark mode support

## Technologies Used

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- next-intl for internationalization
- date-fns for date manipulation

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kurdish-calendar-app.git
   cd kurdish-calendar-app
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/[locale]`: Internationalized pages
- `app/components`: Reusable UI components
- `public/locales`: Translation files for different languages
- `public/data`: Holiday and event data

## Internationalization

The app supports the following languages:
- English (en)
- Kurdish (ku)
- Arabic (ar)
- Persian (fa)

Language files are stored in `public/locales/{language}/common.json`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Kurdish cultural organizations for holiday information
- Next.js team for the amazing framework
- The open-source community for various libraries used in this project
