import {
  formatBashurDate,
  formatHijriDate,
  formatPersianDate,
  formatRojhalatDate,
} from './utils';

export type SupportedLocale = 'en' | 'ku' | 'ar' | 'fa';

export interface LocalizedText {
  en: string;
  ku: string;
  ar: string;
  fa: string;
}

export interface CalendarEvent {
  date: string;
  isHoliday: boolean;
  event: LocalizedText;
  note?: Partial<LocalizedText>;
  country?: string;
  region?: string;
}

export interface CulturalHeritageEntry {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  regions: string[];
  themes: string[];
  preservationPrompts: Record<SupportedLocale, string[]>;
  sources: Array<{ label: string; url: string }>;
}

export interface CulturalPlanItem {
  date: string;
  time?: string;
  activity: string;
  note?: string;
}

export interface CulturalPlanDraft {
  title: string;
  purpose: string;
  audience: string;
  languages: string[];
  items: CulturalPlanItem[];
  sourceUrls: string[];
  consentRequired: true;
}

export const CULTURAL_PLAN_DRAFT_EVENT = 'kurdish-calendar:webmcp-plan-draft';
export const CALENDAR_OPEN_DATE_EVENT = 'kurdish-calendar:webmcp-open-date';

export function dispatchCalendarOpenDate(target: EventTarget, date: string): void {
  parseDateOnly(date);
  target.dispatchEvent(new CustomEvent<string>(CALENDAR_OPEN_DATE_EVENT, { detail: date }));
}

export interface WebMcpToolResult {
  content: Array<{ type: 'text'; text: string }>;
  structuredContent: Record<string, unknown>;
}

export interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  execute(input: Record<string, unknown>): WebMcpToolResult | Promise<WebMcpToolResult>;
}

export interface WebMcpModelContext {
  registerTool(tool: WebMcpTool, options: { signal: AbortSignal }): Promise<unknown> | unknown;
}

interface CalendarToolDependencies {
  events: CalendarEvent[];
  heritage: CulturalHeritageEntry[];
  locale: SupportedLocale;
  openDate(date: string): void;
  stagePlan(plan: CulturalPlanDraft): void;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UTC_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?Z$/;
const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'ku', 'ar', 'fa'];

function parseDateOnly(value: unknown, field = 'date'): Date {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    throw new Error(`${field} must use YYYY-MM-DD format.`);
  }
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${field} must be a valid calendar date.`);
  }
  return date;
}

function getLocale(value: unknown, fallback: SupportedLocale): SupportedLocale {
  return typeof value === 'string' && SUPPORTED_LOCALES.includes(value as SupportedLocale)
    ? value as SupportedLocale
    : fallback;
}

function result(text: string, structuredContent: Record<string, unknown>): WebMcpToolResult {
  return { content: [{ type: 'text', text }], structuredContent };
}

export function createDateContext(dateValue: string, locale: SupportedLocale) {
  const date = parseDateOnly(dateValue);
  return {
    date: dateValue,
    gregorian: new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeZone: 'UTC',
    }).format(date),
    kurdishRojhalat: formatRojhalatDate(date, locale).formatted,
    kurdishBashur: formatBashurDate(date, locale).formatted,
    persian: formatPersianDate(date, locale).formatted,
    hijri: formatHijriDate(date, locale).formatted,
  };
}

export interface GlobalTimeComparison {
  instant: string;
  inconvenientCount: number;
  locations: Array<{
    timeZone: string;
    localDate: string;
    localTime: string;
    hour: number;
    comfortable: boolean;
  }>;
}

export function compareGlobalTimes(
  instants: string[],
  timeZones: string[],
  locale: SupportedLocale,
): GlobalTimeComparison[] {
  if (instants.length < 1 || instants.length > 6) throw new Error('candidateInstants must contain between 1 and 6 UTC times.');
  if (timeZones.length < 1 || timeZones.length > 8) throw new Error('timeZones must contain between 1 and 8 IANA zones.');
  const uniqueZones = Array.from(new Set(timeZones));
  const comparisons = instants.map((instant) => {
    if (!UTC_INSTANT_PATTERN.test(instant) || Number.isNaN(Date.parse(instant))) {
      throw new Error('Each candidate instant must be an ISO UTC time such as 2026-03-21T13:00:00Z.');
    }
    const date = new Date(instant);
    const locations = uniqueZones.map((timeZone) => {
      let parts: Intl.DateTimeFormatPart[];
      try {
        parts = new Intl.DateTimeFormat('en-GB', {
          timeZone,
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
        }).formatToParts(date);
      } catch {
        throw new Error(`${timeZone} must be a valid IANA time zone.`);
      }
      const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
      const hour = Number(get('hour'));
      return {
        timeZone,
        localDate: `${get('year')}-${get('month')}-${get('day')}`,
        localTime: new Intl.DateTimeFormat(locale, {
          timeZone, hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
        }).format(date),
        hour,
        comfortable: hour >= 8 && hour < 22,
      };
    });
    return {
      instant,
      inconvenientCount: locations.filter((location) => !location.comfortable).length,
      locations,
    };
  });
  return comparisons.sort((a, b) => a.inconvenientCount - b.inconvenientCount || a.instant.localeCompare(b.instant));
}

export function buildKurdishCalendarTools(deps: CalendarToolDependencies): WebMcpTool[] {
  return [
    {
      name: 'kurdish_calendar_get_today',
      description: 'Get today in Gregorian, Kurdish Rojhalat, Kurdish Bashur, Persian, and Hijri calendars.',
      inputSchema: {
        type: 'object',
        properties: {
          language: { type: 'string', enum: SUPPORTED_LOCALES },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        const language = getLocale(input.language, deps.locale);
        const today = new Date().toISOString().slice(0, 10);
        return result(`Today across five calendar views is ${today}.`, createDateContext(today, language));
      },
    },
    {
      name: 'kurdish_calendar_convert_date',
      description: 'Convert one Gregorian date into the calendar systems displayed by Kurdish Calendar.',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Gregorian date in YYYY-MM-DD format.' },
          language: { type: 'string', enum: SUPPORTED_LOCALES },
        },
        required: ['date'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        const date = String(input.date ?? '');
        const language = getLocale(input.language, deps.locale);
        const context = createDateContext(date, language);
        return result(`Converted ${date} across the calendars shown by Kurdish Calendar.`, context);
      },
    },
    {
      name: 'kurdish_calendar_find_events',
      description: 'Find Kurdish cultural events and holidays within an inclusive Gregorian date range.',
      inputSchema: {
        type: 'object',
        properties: {
          startDate: { type: 'string', description: 'Inclusive start date in YYYY-MM-DD format.' },
          endDate: { type: 'string', description: 'Inclusive end date in YYYY-MM-DD format.' },
          language: { type: 'string', enum: SUPPORTED_LOCALES },
          holidaysOnly: { type: 'boolean', default: false },
          query: { type: 'string', description: 'Optional case-insensitive search across localized titles and notes.' },
        },
        required: ['startDate', 'endDate'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        const startDate = String(input.startDate ?? '');
        const endDate = String(input.endDate ?? '');
        parseDateOnly(startDate, 'startDate');
        parseDateOnly(endDate, 'endDate');
        if (endDate < startDate) throw new Error('endDate must be on or after startDate.');
        const language = getLocale(input.language, deps.locale);
        const query = typeof input.query === 'string' ? input.query.trim().toLocaleLowerCase() : '';
        const holidaysOnly = input.holidaysOnly === true;
        const matches = deps.events
          .filter((event) => event.date >= startDate && event.date <= endDate)
          .filter((event) => !holidaysOnly || event.isHoliday)
          .filter((event) => {
            if (!query) return true;
            return [...Object.values(event.event), ...Object.values(event.note ?? {})]
              .some((value) => value?.toLocaleLowerCase().includes(query));
          })
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((event) => ({
            date: event.date,
            title: event.event[language] || event.event.en,
            isHoliday: event.isHoliday,
            country: event.country,
            region: event.region,
            calendarContext: createDateContext(event.date, language),
          }));
        return result(`Found ${matches.length} matching cultural events.`, {
          count: matches.length,
          startDate,
          endDate,
          language,
          events: matches,
        });
      },
    },
    {
      name: 'kurdish_calendar_explore_heritage',
      description: 'Explore a sourced, multilingual Kurdish cultural-preservation archive across Kurdistan and the global diaspora.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Optional search across titles, summaries, themes, and preservation prompts.' },
          region: { type: 'string', description: 'Optional region such as bashur, bakur, rojhelat, rojava, all-regions, or diaspora.' },
          language: { type: 'string', enum: SUPPORTED_LOCALES },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        const language = getLocale(input.language, deps.locale);
        const query = typeof input.query === 'string' ? input.query.trim().toLocaleLowerCase() : '';
        const region = typeof input.region === 'string' ? input.region.trim().toLocaleLowerCase() : '';
        const entries = deps.heritage
          .filter((entry) => !region || entry.regions.some((value) => value.toLocaleLowerCase() === region))
          .filter((entry) => {
            if (!query) return true;
            const searchable = [
              ...Object.values(entry.title),
              ...Object.values(entry.summary),
              ...entry.themes,
              ...Object.values(entry.preservationPrompts).flat(),
            ];
            return searchable.some((value) => value.toLocaleLowerCase().includes(query));
          })
          .map((entry) => ({
            id: entry.id,
            title: entry.title[language],
            summary: entry.summary[language],
            regions: entry.regions,
            themes: entry.themes,
            preservationPrompts: entry.preservationPrompts[language],
            sources: entry.sources,
          }));
        return result(`Found ${entries.length} sourced cultural-preservation entries.`, {
          count: entries.length,
          language,
          region: region || 'any',
          entries,
        });
      },
    },
    {
      name: 'kurdish_calendar_compare_global_times',
      description: 'Compare and rank candidate UTC times for Kurdish communities in multiple IANA time zones; comfortable hours are 08:00–21:59 local.',
      inputSchema: {
        type: 'object',
        properties: {
          candidateInstants: {
            type: 'array', minItems: 1, maxItems: 6,
            items: { type: 'string', description: 'ISO UTC time such as 2026-03-21T13:00:00Z.' },
          },
          timeZones: {
            type: 'array', minItems: 1, maxItems: 8, uniqueItems: true,
            items: { type: 'string', description: 'IANA time zone such as Asia/Baghdad or America/Toronto.' },
          },
          language: { type: 'string', enum: SUPPORTED_LOCALES },
        },
        required: ['candidateInstants', 'timeZones'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        if (!Array.isArray(input.candidateInstants) || !input.candidateInstants.every((value) => typeof value === 'string')) {
          throw new Error('candidateInstants must be an array of ISO UTC times.');
        }
        if (!Array.isArray(input.timeZones) || !input.timeZones.every((value) => typeof value === 'string')) {
          throw new Error('timeZones must be an array of IANA time zones.');
        }
        const language = getLocale(input.language, deps.locale);
        const candidates = compareGlobalTimes(input.candidateInstants, input.timeZones, language);
        return result(`Compared ${candidates.length} candidate times across ${input.timeZones.length} locations.`, {
          language,
          comfortWindow: '08:00–21:59 local time',
          candidates,
          recommendedInstant: candidates[0]?.instant,
        });
      },
    },
    {
      name: 'kurdish_calendar_open_date',
      description: 'Open a Gregorian date in the visible Kurdish Calendar interface for human inspection.',
      inputSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Gregorian date in YYYY-MM-DD format.' },
        },
        required: ['date'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        const date = String(input.date ?? '');
        parseDateOnly(date);
        deps.openDate(date);
        return result(`Opened ${date} in Kurdish Calendar.`, { date, status: 'opened' });
      },
    },
    {
      name: 'kurdish_calendar_stage_preservation_brief',
      description: 'Stage an editable, consent-first cultural preservation brief for a family, school, or diaspora community; this never saves or publishes it.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 100 },
          purpose: { type: 'string', minLength: 1, maxLength: 240 },
          audience: { type: 'string', minLength: 1, maxLength: 160 },
          languages: {
            type: 'array', minItems: 1, maxItems: 4, uniqueItems: true,
            items: { type: 'string', enum: SUPPORTED_LOCALES },
          },
          items: {
            type: 'array',
            minItems: 1,
            maxItems: 6,
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', description: 'Gregorian date in YYYY-MM-DD format.' },
                time: { type: 'string', description: 'Optional local time such as 10:00.' },
                activity: { type: 'string', minLength: 1, maxLength: 180 },
                note: { type: 'string', maxLength: 240 },
              },
              required: ['date', 'activity'],
              additionalProperties: false,
            },
          },
          sourceUrls: {
            type: 'array', maxItems: 8, uniqueItems: true,
            items: { type: 'string', description: 'HTTPS source or attribution URL.' },
          },
        },
        required: ['title', 'purpose', 'audience', 'languages', 'items', 'sourceUrls'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        if (typeof input.title !== 'string' || !input.title.trim()) throw new Error('title is required.');
        if (typeof input.purpose !== 'string' || !input.purpose.trim()) throw new Error('purpose is required.');
        if (typeof input.audience !== 'string' || !input.audience.trim()) throw new Error('audience is required.');
        if (!Array.isArray(input.languages) || input.languages.length < 1 || input.languages.length > 4
          || !input.languages.every((language) => typeof language === 'string' && SUPPORTED_LOCALES.includes(language as SupportedLocale))) {
          throw new Error('languages must contain between 1 and 4 supported language codes.');
        }
        if (!Array.isArray(input.sourceUrls) || input.sourceUrls.length > 8 || !input.sourceUrls.every((source) => {
          if (typeof source !== 'string') return false;
          try { return new URL(source).protocol === 'https:'; } catch { return false; }
        })) {
          throw new Error('sourceUrls must contain up to 8 HTTPS URLs.');
        }
        if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 6) {
          throw new Error('items must contain between 1 and 6 activities.');
        }
        const plan: CulturalPlanDraft = {
          title: input.title.trim(),
          purpose: input.purpose.trim(),
          audience: input.audience.trim(),
          languages: input.languages as string[],
          items: input.items.map((raw) => {
            if (!raw || typeof raw !== 'object') throw new Error('Each plan item must be an object.');
            const item = raw as Record<string, unknown>;
            const date = String(item.date ?? '');
            parseDateOnly(date);
            if (typeof item.activity !== 'string' || !item.activity.trim()) throw new Error('Each plan item needs an activity.');
            return {
              date,
              time: typeof item.time === 'string' ? item.time : undefined,
              activity: item.activity.trim(),
              note: typeof item.note === 'string' ? item.note.trim() : undefined,
            };
          }),
          sourceUrls: input.sourceUrls as string[],
          consentRequired: true,
        };
        deps.stagePlan(plan);
        return result('Staged an editable cultural preservation brief for human review. Nothing was saved or published.', {
          status: 'draft',
          saved: false,
          published: false,
          consentRequired: true,
          plan,
        });
      },
    },
  ];
}

export function registerKurdishCalendarTools(context: WebMcpModelContext, tools: WebMcpTool[]): () => void {
  const controller = new AbortController();
  const registrations: Promise<unknown>[] = [];
  try {
    for (const tool of tools) {
      registrations.push(Promise.resolve(context.registerTool(tool, { signal: controller.signal })));
    }
  } catch {
    controller.abort();
    return () => controller.abort();
  }
  void Promise.all(registrations).catch(() => controller.abort());
  return () => controller.abort();
}
