import CalendarClient from './CalendarClient';

interface CalendarProps {
  locale: string;
}

export default function Calendar({ locale }: CalendarProps) {
  return <CalendarClient locale={locale} />;
} 