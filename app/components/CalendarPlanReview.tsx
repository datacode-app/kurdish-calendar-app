'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarClock, Check, Clipboard, Globe2, X } from 'lucide-react';
import {
  CALENDAR_PLAN_DRAFT_EVENT,
  formatCalendarPlan,
  type CalendarPlanDraft,
} from '@/lib/webmcp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPlanReview() {
  const [plan, setPlan] = useState<CalendarPlanDraft | null>(null);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDraft = (event: Event) => {
      setPlan((event as CustomEvent<CalendarPlanDraft>).detail);
      setCopied(false);
    };
    window.addEventListener(CALENDAR_PLAN_DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(CALENDAR_PLAN_DRAFT_EVENT, onDraft);
  }, []);

  useEffect(() => {
    if (plan) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [plan]);

  if (!plan) return null;

  return (
    <div ref={panelRef} className="container mx-auto px-4 pb-8 md:px-6" role="region" aria-label="Calendar event plan" aria-live="polite">
      <Card dir="ltr" className="mx-auto max-w-5xl border-primary/40 bg-primary/5 shadow-lg">
        <CardHeader className="relative pb-3 pr-14">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <CalendarClock className="h-4 w-4" />
              Event plan staged for your review
            </div>
            <CardTitle className="flex min-w-0 items-center gap-2 text-lg">
              <input
                aria-label="Plan title"
                dir="auto"
                className="min-w-0 flex-1 bg-transparent outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                value={plan.title}
                onChange={(event) => setPlan({ ...plan, title: event.target.value })}
              />
            </CardTitle>
          </div>
          <Button className="absolute right-4 top-4" variant="ghost" size="icon" aria-label="Dismiss plan" onClick={() => setPlan(null)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your browser agent coordinated this event across calendars and time zones. Review the details and edit the title, event, or notes before copying; nothing has been saved, shared, or sent.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-muted-foreground">
              Event
              <input
                aria-label="Event title"
                dir="auto"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={plan.eventTitle}
                onChange={(event) => setPlan({ ...plan, eventTitle: event.target.value })}
              />
            </label>
            <div className="space-y-1 text-xs font-semibold text-muted-foreground">
              Gregorian date and suggested meeting time
              <div className="flex min-h-10 items-center rounded-md border bg-background px-3 text-sm font-normal text-foreground">
                {plan.date} · {plan.selectedInstant.replace('T', ' ').replace('Z', ' UTC')}
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Calendar conversions">
            {[
              ['Kurdish (Bashur)', plan.calendarContext.kurdishBashur],
              ['Kurdish (Rojhalat)', plan.calendarContext.kurdishRojhalat],
              ['Persian', plan.calendarContext.persian],
              ['Hijri', plan.calendarContext.hijri],
            ].map(([label, value]) => (
              <div className="rounded-lg border bg-background/80 p-3" key={label}>
                <div className="text-xs font-semibold text-primary">{label}</div>
                <div className="mt-1 text-sm text-foreground" dir="auto">{value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-background/70 p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Globe2 className="h-4 w-4 text-primary" />
              One moment, shown locally
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {plan.localTimes.map((location) => (
                <div className="rounded-md border bg-muted/20 px-3 py-2" key={location.timeZone}>
                  <div className="text-xs font-medium text-muted-foreground">{location.timeZone}</div>
                  <div className="mt-1 text-sm font-semibold">{location.localDate} · {location.localTime}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                    <Check className="h-3.5 w-3.5" /> {location.comfortable ? 'Comfortable hour' : 'Review local hour'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className="block space-y-1 text-xs font-semibold text-muted-foreground">
            Notes
            <textarea
              aria-label="Plan notes"
              dir="auto"
              className="min-h-20 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={plan.notes ?? ''}
              onChange={(event) => setPlan({ ...plan, notes: event.target.value })}
              placeholder="Add details before sharing the plan yourself."
            />
          </label>

          <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-muted-foreground">Private draft · not saved, shared, or sent</span>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(formatCalendarPlan(plan));
                setCopied(true);
              }}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              {copied ? 'Copied' : 'Copy event plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
