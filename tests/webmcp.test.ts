import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  buildKurdishCalendarTools,
  CALENDAR_OPEN_DATE_EVENT,
  compareGlobalTimes,
  createDateContext,
  dispatchCalendarOpenDate,
  formatCalendarPlan,
  registerKurdishCalendarTools,
  type CalendarEvent,
  type WebMcpModelContext,
} from '../lib/webmcp';
import { getCalendarDataUrl } from '../lib/calendar-data-url';

const events: CalendarEvent[] = [
  {
    date: '2026-03-21',
    isHoliday: true,
    event: {
      en: 'Nawroz Kurdish New Year',
      ku: 'نەورۆز، ساڵی نوێی کوردی',
      ar: 'نوروز، السنة الكردية الجديدة',
      fa: 'نوروز، سال نو کردی',
    },
    country: 'Kurdistan',
    region: 'All regions',
  },
  {
    date: '2026-03-10',
    isHoliday: false,
    event: {
      en: 'Kurdish Clothing Day',
      ku: 'ڕۆژی جلوبەرگی کوردی',
      ar: 'يوم الزي الكردي',
      fa: 'روز پوشش کردی',
    },
  },
];

function dependencies(overrides: Partial<Parameters<typeof buildKurdishCalendarTools>[0]> = {}) {
  return {
    events,
    locale: 'en' as const,
    openDate: vi.fn(),
    stagePlan: vi.fn(),
    ...overrides,
  };
}

describe('Kurdish Calendar WebMCP tools', () => {
  it('keeps Nawroz separate from coincident religious observances', () => {
    const data = JSON.parse(readFileSync(new URL('../public/data/holidays.json', import.meta.url), 'utf8')) as { holidays: CalendarEvent[] };
    const march21 = data.holidays.filter((event) => event.date === '2026-03-21');
    expect(march21.some((event) => event.event.en === 'Nawroz Kurdish New Year')).toBe(true);
    expect(march21.some((event) => event.event.en.includes('Nawroz') && event.event.en.includes('Eid'))).toBe(false);
  });

  it('exposes only the five tools needed for a coherent calendar-planning workflow', () => {
    const tools = buildKurdishCalendarTools(dependencies());
    expect(tools.map((tool) => tool.name)).toEqual([
      'kurdish_calendar_convert_date',
      'kurdish_calendar_find_events',
      'kurdish_calendar_compare_global_times',
      'kurdish_calendar_open_date',
      'kurdish_calendar_stage_event_plan',
    ]);
  });

  it('uses the bundled event data when no API base URL is configured', () => {
    expect(getCalendarDataUrl(undefined)).toBe('/data/holidays.json');
    expect(getCalendarDataUrl('undefined')).toBe('/data/holidays.json');
    expect(getCalendarDataUrl('https://api.calendar.krd/')).toBe('https://api.calendar.krd/data/holidays.json');
  });

  it('emits an open-date event so an already-mounted calendar follows agent navigation', () => {
    const target = new EventTarget();
    let openedDate = '';
    target.addEventListener(CALENDAR_OPEN_DATE_EVENT, (event) => {
      openedDate = (event as CustomEvent<string>).detail;
    });
    dispatchCalendarOpenDate(target, '2026-03-21');
    expect(openedDate).toBe('2026-03-21');
  });

  it('converts a Gregorian date into the calendar systems shown by the product', () => {
    const context = createDateContext('2026-03-21', 'en');
    expect(context.gregorian).toContain('2026');
    expect(context.kurdishRojhalat).toBeTruthy();
    expect(context.kurdishBashur).toBeTruthy();
    expect(context.persian).toBeTruthy();
    expect(context.hijri).toBeTruthy();
  });

  it('finds cultural events in the requested date range and language', async () => {
    const tools = buildKurdishCalendarTools(dependencies());
    const findEvents = tools.find((tool) => tool.name === 'kurdish_calendar_find_events');
    const result = await findEvents?.execute({ startDate: '2026-03-20', endDate: '2026-03-22', language: 'ku' });
    expect(result?.structuredContent).toMatchObject({
      count: 1,
      events: [{ date: '2026-03-21', title: 'نەورۆز، ساڵی نوێی کوردی' }],
    });
  });


  it('ranks UTC meeting candidates for Kurdish communities in different countries', () => {
    const comparison = compareGlobalTimes(
      ['2026-03-21T13:00:00Z', '2026-03-21T20:00:00Z'],
      ['Asia/Baghdad', 'Europe/London', 'America/Toronto'],
      'en',
    );
    expect(comparison[0]).toMatchObject({ instant: '2026-03-21T13:00:00Z', inconvenientCount: 0 });
    expect(comparison[0].locations).toHaveLength(3);
    expect(comparison[1].inconvenientCount).toBeGreaterThan(0);
  });

  it('opens a valid date in the real calendar UI', async () => {
    const openDate = vi.fn();
    const tools = buildKurdishCalendarTools(dependencies({ openDate }));
    const open = tools.find((tool) => tool.name === 'kurdish_calendar_open_date');
    await open?.execute({ date: '2026-03-21' });
    expect(openDate).toHaveBeenCalledWith('2026-03-21');
  });

  it('stages a practical diaspora event plan without saving or sharing it', async () => {
    const stagePlan = vi.fn();
    const tools = buildKurdishCalendarTools(dependencies({ stagePlan }));
    const stage = tools.find((tool) => tool.name === 'kurdish_calendar_stage_event_plan');
    const input = {
      title: 'Nawroz across time zones',
      date: '2026-03-21',
      eventTitle: 'Nawroz Kurdish New Year',
      selectedInstant: '2026-03-21T13:00:00Z',
      timeZones: ['Asia/Baghdad', 'Europe/London', 'America/Toronto'],
      notes: 'Confirm the final time with the family before sharing.',
    };
    const result = await stage?.execute(input);
    expect(stagePlan).toHaveBeenCalledWith(expect.objectContaining({
      ...input,
      calendarContext: expect.objectContaining({ date: '2026-03-21' }),
      localTimes: expect.arrayContaining([
        expect.objectContaining({ timeZone: 'Asia/Baghdad' }),
        expect.objectContaining({ timeZone: 'America/Toronto' }),
      ]),
    }));
    expect(result?.structuredContent).toMatchObject({
      status: 'draft', saved: false, shared: false,
    });
  });

  it('formats an event plan for explicit human copying', () => {
    const text = formatCalendarPlan({
      title: 'Nawroz across time zones',
      date: '2026-03-21',
      eventTitle: 'Nawroz Kurdish New Year',
      selectedInstant: '2026-03-21T13:00:00Z',
      timeZones: ['Asia/Baghdad', 'America/Toronto'],
      notes: 'Confirm before sharing.',
      calendarContext: createDateContext('2026-03-21', 'en'),
      localTimes: compareGlobalTimes(
        ['2026-03-21T13:00:00Z'],
        ['Asia/Baghdad', 'America/Toronto'],
        'en',
      )[0].locations,
    });
    expect(text).toContain('Nawroz Kurdish New Year');
    expect(text).toContain('Asia/Baghdad');
    expect(text).toContain('America/Toronto');
    expect(text).toContain('Not saved or shared');
  });

  it('registers five tools with AbortSignal cleanup', () => {
    const signals: AbortSignal[] = [];
    const context: WebMcpModelContext = {
      registerTool: vi.fn(async (_tool, options) => signals.push(options.signal)),
    };
    const cleanup = registerKurdishCalendarTools(context, buildKurdishCalendarTools(dependencies()));
    expect(context.registerTool).toHaveBeenCalledTimes(5);
    expect(signals.every((signal) => !signal.aborted)).toBe(true);
    cleanup();
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });

  it('fails closed when a browser throws during partial registration', () => {
    const signals: AbortSignal[] = [];
    let calls = 0;
    const context: WebMcpModelContext = {
      registerTool: vi.fn((_tool, options) => {
        signals.push(options.signal);
        calls += 1;
        if (calls === 2) throw new Error('registration failed');
      }),
    };
    expect(() => registerKurdishCalendarTools(context, buildKurdishCalendarTools(dependencies()))).not.toThrow();
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });
});
