'use client';

import { useEffect, useRef, useState } from 'react';
import { BookHeart, Clipboard, Globe2, ShieldCheck, X } from 'lucide-react';
import {
  CULTURAL_PLAN_DRAFT_EVENT,
  type CulturalPlanDraft,
} from '@/lib/webmcp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function briefAsText(plan: CulturalPlanDraft): string {
  return [
    plan.title,
    `Purpose: ${plan.purpose}`,
    `Audience: ${plan.audience}`,
    `Languages: ${plan.languages.join(', ')}`,
    ...plan.items.map((item) => [item.date, item.time, item.activity, item.note].filter(Boolean).join(' — ')),
    ...plan.sourceUrls.map((source) => `Source: ${source}`),
    'Consent required before recording or sharing personal memories.',
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
    <div ref={panelRef} className="container mx-auto px-4 pb-8 md:px-6" role="region" aria-label="Cultural preservation brief" aria-live="polite">
      <Card dir="ltr" className="mx-auto max-w-4xl border-primary/40 bg-primary/5 shadow-lg">
        <CardHeader className="relative pb-3 pr-14">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="h-4 w-4" />
              Consent-first draft for human review
            </div>
            <CardTitle className="flex min-w-0 items-center gap-2 text-lg">
              <BookHeart className="h-5 w-5 shrink-0" />
              <input
                aria-label="Brief title"
                dir="auto"
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
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The browser agent staged this preservation brief locally. Review names, sources, and consent before using it; nothing is saved or published.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-muted-foreground">
              Purpose
              <textarea
                aria-label="Preservation purpose"
                dir="auto"
                className="min-h-20 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={plan.purpose}
                onChange={(event) => setPlan({ ...plan, purpose: event.target.value })}
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-muted-foreground">
              Community or audience
              <textarea
                aria-label="Community or audience"
                dir="auto"
                className="min-h-20 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={plan.audience}
                onChange={(event) => setPlan({ ...plan, audience: event.target.value })}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Globe2 className="h-4 w-4 text-primary" />
            <span>Languages:</span>
            {plan.languages.map((language) => (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-1 font-semibold uppercase text-primary" key={language}>{language}</span>
            ))}
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1 md:max-h-none md:overflow-visible md:pr-0">
            {plan.items.map((item, index) => (
              <div className="rounded-lg border bg-muted/20 p-3" key={`${item.date}-${index}`}>
                <div className="mb-2 text-xs font-semibold text-primary">
                  {item.date}{item.time ? ` · ${item.time}` : ''}
                </div>
                <textarea
                  aria-label={`Activity ${index + 1}`}
                  dir="auto"
                  rows={2}
                  className="min-h-14 w-full resize-y bg-transparent text-sm font-medium leading-5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={item.activity}
                  onChange={(event) => updateItem(index, 'activity', event.target.value)}
                />
                <textarea
                  aria-label={`Note ${index + 1}`}
                  dir="auto"
                  className="mt-2 min-h-20 w-full resize-y rounded-md border bg-background px-2 py-1.5 text-sm leading-5 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Optional note"
                  value={item.note ?? ''}
                  onChange={(event) => updateItem(index, 'note', event.target.value)}
                />
              </div>
            ))}
          </div>
          {plan.sourceUrls.length > 0 && (
            <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
              <div className="mb-2 font-semibold text-foreground">Sources and attribution</div>
              <ul className="space-y-1">
                {plan.sourceUrls.map((source) => (
                  <li key={source}>
                    <a className="break-all text-primary underline underline-offset-2" href={source} target="_blank" rel="noreferrer">
                      {new URL(source).hostname.replace(/^www\./, '')} — view source
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            Ask permission before recording people, family stories, voices, photographs, or names. The contributor decides what stays private and how they are credited.
          </div>
          <div className="flex items-center justify-between gap-3 border-t pt-3">
            <span className="text-xs text-muted-foreground">Private, unsaved draft</span>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(briefAsText(plan));
                setCopied(true);
              }}
            >
              <Clipboard className="mr-2 h-4 w-4" />
              {copied ? 'Copied' : 'Copy brief'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
