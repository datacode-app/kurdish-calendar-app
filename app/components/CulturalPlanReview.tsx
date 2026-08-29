'use client';

import { useEffect, useRef, useState } from 'react';
import { CalendarRange, Clipboard, ShieldCheck, X } from 'lucide-react';
import {
  CULTURAL_PLAN_DRAFT_EVENT,
  type CulturalPlanDraft,
} from '@/lib/webmcp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function planAsText(plan: CulturalPlanDraft): string {
  return [
    plan.title,
    ...plan.items.map((item) => [
      item.date,
      item.time,
      item.activity,
      item.note,
    ].filter(Boolean).join(' — ')),
  ].join('\n');
}

export default function CulturalPlanReview() {
  const [plan, setPlan] = useState<CulturalPlanDraft | null>(null);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDraft = (event: Event) => {
      setPlan((event as CustomEvent<CulturalPlanDraft>).detail);
      setCopied(false);
    };
    window.addEventListener(CULTURAL_PLAN_DRAFT_EVENT, onDraft);
    return () => window.removeEventListener(CULTURAL_PLAN_DRAFT_EVENT, onDraft);
  }, []);

  useEffect(() => {
    if (plan) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [plan]);

  if (!plan) return null;

  const updateItem = (index: number, field: 'activity' | 'note', value: string) => {
    setPlan((current) => current ? {
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    } : current);
  };

  return (
    <div ref={panelRef} className="container mx-auto px-4 pb-8 md:px-6" role="region" aria-label="Cultural plan draft" aria-live="polite">
      <Card className="mx-auto max-w-3xl border-primary/40 bg-primary/5 shadow-lg">
        <CardHeader className="relative pb-3 pr-14">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="h-4 w-4" />
              Draft for human review
            </div>
            <CardTitle className="flex min-w-0 items-center gap-2 text-lg">
              <CalendarRange className="h-5 w-5" />
              <input
                aria-label="Plan title"
                className="min-w-0 flex-1 bg-transparent outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                value={plan.title}
                onChange={(event) => setPlan({ ...plan, title: event.target.value })}
              />
            </CardTitle>
          </div>
          <Button className="absolute right-4 top-4" variant="ghost" size="icon" aria-label="Dismiss draft" onClick={() => setPlan(null)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The browser agent staged this plan locally. Review and edit it; nothing is booked, saved, or published.
          </p>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {plan.items.map((item, index) => (
              <div className="rounded-lg border bg-muted/20 p-3" key={`${item.date}-${index}`}>
                <div className="mb-2 text-xs font-semibold text-primary">
                  {item.date}{item.time ? ` · ${item.time}` : ''}
                </div>
                <input
                  aria-label={`Activity ${index + 1}`}
                  className="w-full bg-transparent text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={item.activity}
                  onChange={(event) => updateItem(index, 'activity', event.target.value)}
                />
                <textarea
                  aria-label={`Note ${index + 1}`}
                  className="mt-2 min-h-12 w-full resize-y rounded-md border bg-background px-2 py-1.5 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Optional note"
                  value={item.note ?? ''}
                  onChange={(event) => updateItem(index, 'note', event.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border-t pt-3">
            <span className="text-xs text-muted-foreground">Unsaved draft</span>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(planAsText(plan));
                setCopied(true);
              }}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              {copied ? 'Copied' : 'Copy plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
