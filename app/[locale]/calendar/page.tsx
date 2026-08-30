import Navigation from '../../components/Navigation';
import Calendar from '../../components/Calendar';
import { Card, CardContent } from '@/components/ui/card';
import { BookHeart, Bot, Globe2, Languages, Library, ShieldCheck } from 'lucide-react';

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto mb-4 flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Bot className="h-4 w-4 text-primary" />
            Kurdish Cultural Memory · 7 WebMCP tools
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Consent-first drafts stay private until you decide
          </div>
        </div>
        <section className="mx-auto mb-4 overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-5 md:p-6" aria-labelledby="cultural-memory-heading">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <BookHeart className="h-4 w-4" />
                Built for every Kurdish community
              </div>
              <h1 id="cultural-memory-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
                Preserve living culture across borders and generations
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                Explore sourced traditions, translate dates across calendar systems, coordinate diaspora communities across time zones, and prepare editable family or school preservation briefs—with attribution and consent built in.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><Globe2 className="h-4 w-4 text-primary" />Kurdistan + diaspora</div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><Languages className="h-4 w-4 text-primary" />4 languages</div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><Library className="h-4 w-4 text-primary" />Sourced archive</div>
              <div className="flex items-center gap-2 rounded-lg border bg-background/70 p-3"><ShieldCheck className="h-4 w-4 text-primary" />Human controlled</div>
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
