import { getTranslations } from 'next-intl/server';
import Navigation from '../../components/Navigation';
import Calendar from '../../components/Calendar';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftRight, Bot, CalendarClock, Globe2, Languages, UserCheck } from 'lucide-react';

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('agentCalendar');
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto mb-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Bot className="h-4 w-4 text-primary" />
            {t('badge')}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCheck className="h-4 w-4 text-primary" />
            {t('consent')}
          </div>
        </div>
        <section className="mx-auto mb-4 overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-5 md:p-6" aria-labelledby="calendar-agent-heading">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <CalendarClock className="h-4 w-4" />
                {t('eyebrow')}
              </div>
              <h1 id="calendar-agent-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
                {t('title')}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                {t('description')}
              </p>
              <div className="mt-4 rounded-lg border border-primary/20 bg-background/70 p-3 text-sm">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{t('exampleLabel')}</div>
                <blockquote className="leading-6 text-foreground">“{t('examplePrompt')}”</blockquote>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><CalendarClock className="h-4 w-4 text-primary" />{t('tags.events')}</div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><ArrowLeftRight className="h-4 w-4 text-primary" />{t('tags.calendars')}</div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><Globe2 className="h-4 w-4 text-primary" />{t('tags.timeZones')}</div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><Languages className="h-4 w-4 text-primary" />{t('tags.humanControlled')}</div>
            </div>
          </div>
        </section>
        <Card className="mx-auto">
          <CardContent className="p-4 md:p-6">
            <Calendar locale={locale} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
