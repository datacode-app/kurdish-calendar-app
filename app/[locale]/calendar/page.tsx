import Navigation from '../../components/Navigation';
import Calendar from '../../components/Calendar';
import { Card, CardContent } from '@/components/ui/card';

export default async function CalendarPage({ 
  params 
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mx-auto">
          <CardContent className="p-4 md:p-6">
            <Calendar locale={locale} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 