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

export interface CulturalPlanItem {
  date: string;
  time?: string;
  activity: string;
  note?: string;
}

export interface CulturalPlanDraft {
  title: string;
  items: CulturalPlanItem[];
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
  locale: SupportedLocale;
  openDate(date: string): void;
  stagePlan(plan: CulturalPlanDraft): void;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
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
      name: 'kurdish_calendar_stage_plan',
      description: 'Stage an editable cultural itinerary in Kurdish Calendar for human review; this never saves, books, or publishes it.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 100 },
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
        },
        required: ['title', 'items'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      execute(input) {
        if (typeof input.title !== 'string' || !input.title.trim()) throw new Error('title is required.');
        if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 6) {
          throw new Error('items must contain between 1 and 6 activities.');
        }
        const plan: CulturalPlanDraft = {
          title: input.title.trim(),
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
        };
        deps.stagePlan(plan);
        return result('Staged an editable cultural plan for human review. Nothing was saved or published.', {
          status: 'draft',
          saved: false,
          published: false,
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
