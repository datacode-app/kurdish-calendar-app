import { describe, expect, it, vi } from 'vitest';
import {
  buildKurdishCalendarTools,
  CALENDAR_OPEN_DATE_EVENT,
  createDateContext,
  dispatchCalendarOpenDate,
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

describe('Kurdish Calendar WebMCP tools', () => {
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
    const tools = buildKurdishCalendarTools({
      events,
      locale: 'en',
      openDate: vi.fn(),
      stagePlan: vi.fn(),
    });
    const findEvents = tools.find((tool) => tool.name === 'kurdish_calendar_find_events');

    const result = await findEvents?.execute({
      startDate: '2026-03-20',
      endDate: '2026-03-22',
      language: 'ku',
    });

    expect(result?.structuredContent).toMatchObject({
      count: 1,
      events: [{ date: '2026-03-21', title: 'نەورۆز، ساڵی نوێی کوردی' }],
    });
  });

  it('opens a valid date in the real calendar UI', async () => {
    const openDate = vi.fn();
    const tools = buildKurdishCalendarTools({ events, locale: 'en', openDate, stagePlan: vi.fn() });
    const open = tools.find((tool) => tool.name === 'kurdish_calendar_open_date');

    await open?.execute({ date: '2026-03-21' });

    expect(openDate).toHaveBeenCalledWith('2026-03-21');
  });

  it('stages an editable itinerary for human review without saving or publishing it', async () => {
    const stagePlan = vi.fn();
    const tools = buildKurdishCalendarTools({ events, locale: 'en', openDate: vi.fn(), stagePlan });
    const stage = tools.find((tool) => tool.name === 'kurdish_calendar_stage_plan');
    const plan = {
      title: 'Nawroz cultural weekend',
      items: [
        { date: '2026-03-21', time: '10:00', activity: 'Visit the Nawroz celebration', note: 'Confirm locally' },
      ],
    };

    const result = await stage?.execute(plan);

    expect(stagePlan).toHaveBeenCalledWith(plan);
    expect(result?.structuredContent).toMatchObject({ status: 'draft', saved: false, published: false });
    expect(tools.some((tool) => tool.name.includes('save') || tool.name.includes('publish'))).toBe(false);
  });

  it('registers tools with AbortSignal cleanup and aborts partial registration failures', async () => {
    const signals: AbortSignal[] = [];
    const context: WebMcpModelContext = {
      registerTool: vi.fn(async (_tool, options) => {
        signals.push(options.signal);
      }),
    };
    const cleanup = registerKurdishCalendarTools(context, buildKurdishCalendarTools({
      events,
      locale: 'en',
      openDate: vi.fn(),
      stagePlan: vi.fn(),
    }));

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

    expect(() => registerKurdishCalendarTools(context, buildKurdishCalendarTools({
      events,
      locale: 'en',
      openDate: vi.fn(),
      stagePlan: vi.fn(),
    }))).not.toThrow();
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });
});
