import Navigation from '../../components/Navigation';
import Calendar from '../../components/Calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, ShieldCheck } from 'lucide-react';

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
        <div className="mx-auto mb-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Bot className="h-4 w-4 text-primary" />
            Agent-ready calendar · 5 WebMCP tools
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Plans stay editable and unsaved until you decide
          </div>
        </div>
        <Card className="mx-auto">
          <CardContent className="p-4 md:p-6">
            <Calendar locale={locale} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 