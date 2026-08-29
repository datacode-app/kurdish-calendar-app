'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCalendarDataUrl } from '@/lib/calendar-data-url';
import {
  buildKurdishCalendarTools,
  CULTURAL_PLAN_DRAFT_EVENT,
  dispatchCalendarOpenDate,
  registerKurdishCalendarTools,
  type CalendarEvent,
  type CulturalPlanDraft,
  type SupportedLocale,
  type WebMcpModelContext,
} from '@/lib/webmcp';

interface DocumentWithModelContext extends Document {
  modelContext?: WebMcpModelContext;
}

export default function WebMcpBridge({ locale }: { locale: string }) {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const safeLocale: SupportedLocale = ['en', 'ku', 'ar', 'fa'].includes(locale)
    ? locale as SupportedLocale
    : 'en';

  useEffect(() => {
    const controller = new AbortController();
    void fetch(getCalendarDataUrl(process.env.NEXT_PUBLIC_API_BASE_URL), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Calendar data request failed (${response.status}).`);
        return response.json() as Promise<CalendarEvent[] | { holidays?: CalendarEvent[] }>;
      })
      .then((data) => setEvents(Array.isArray(data) ? data : data.holidays ?? []))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('WebMCP calendar data could not be loaded:', error);
        }
      });
    return () => controller.abort();
  }, []);

  const tools = useMemo(() => buildKurdishCalendarTools({
    events,
    locale: safeLocale,
    openDate: (date) => {
      dispatchCalendarOpenDate(window, date);
      router.push(`/${safeLocale}/calendar?date=${date}`);
    },
    stagePlan: (plan: CulturalPlanDraft) => {
      window.dispatchEvent(new CustomEvent<CulturalPlanDraft>(CULTURAL_PLAN_DRAFT_EVENT, { detail: plan }));
    },
  }), [events, router, safeLocale]);

  useEffect(() => {
    const context = (document as DocumentWithModelContext).modelContext;
    if (!context) return;
    return registerKurdishCalendarTools(context, tools);
  }, [tools]);

  return null;
}
