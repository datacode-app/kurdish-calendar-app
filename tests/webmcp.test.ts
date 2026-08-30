import { describe, expect, it, vi } from 'vitest';
import {
  buildKurdishCalendarTools,
  CALENDAR_OPEN_DATE_EVENT,
  compareGlobalTimes,
  createDateContext,
  dispatchCalendarOpenDate,
  registerKurdishCalendarTools,
  type CalendarEvent,
  type CulturalHeritageEntry,
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

const heritage: CulturalHeritageEntry[] = [
  {
    id: 'nawroz',
    title: { en: 'Nawroz', ku: 'نەورۆز', ar: 'نوروز', fa: 'نوروز' },
    summary: {
      en: 'A spring new year celebration shared across Kurdish communities.',
      ku: 'جەژنی ساڵی نوێی بەهارە لە کۆمەڵگە کوردییەکان.',
      ar: 'احتفال ربيعي بالسنة الجديدة لدى المجتمعات الكردية.',
      fa: 'جشن سال نوی بهاری در میان جوامع کرد.',
    },
    regions: ['all-regions', 'diaspora'],
    themes: ['new-year', 'music', 'family-memory'],
    preservationPrompts: {
      en: ['Record how your family celebrates Nawroz.'],
      ku: ['تۆمار بکە خێزانەکەت چۆن نەورۆز دەگێڕێت.'],
      ar: ['سجل كيف تحتفل عائلتك بنوروز.'],
      fa: ['ثبت کنید خانواده‌تان نوروز را چگونه جشن می‌گیرد.'],
    },
    sources: [{ label: 'UNESCO Intangible Cultural Heritage', url: 'https://ich.unesco.org/en/RL/00282' }],
  },
];

function dependencies(overrides: Partial<Parameters<typeof buildKurdishCalendarTools>[0]> = {}) {
  return {
    events,
    heritage,
    locale: 'en' as const,
    openDate: vi.fn(),
    stagePlan: vi.fn(),
    ...overrides,
  };
}

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
    const tools = buildKurdishCalendarTools(dependencies());
    const findEvents = tools.find((tool) => tool.name === 'kurdish_calendar_find_events');
    const result = await findEvents?.execute({ startDate: '2026-03-20', endDate: '2026-03-22', language: 'ku' });
    expect(result?.structuredContent).toMatchObject({
      count: 1,
      events: [{ date: '2026-03-21', title: 'نەورۆز، ساڵی نوێی کوردی' }],
    });
  });

  it('searches a sourced cultural archive across the global Kurdish community', async () => {
    const tools = buildKurdishCalendarTools(dependencies());
    const explore = tools.find((tool) => tool.name === 'kurdish_calendar_explore_heritage');
    const found = await explore?.execute({ query: 'family', region: 'diaspora', language: 'ku' });
    expect(found?.structuredContent).toMatchObject({
      count: 1,
      entries: [{ id: 'nawroz', title: 'نەورۆز', regions: ['all-regions', 'diaspora'] }],
    });
    expect(found?.structuredContent.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({ sources: [{ label: 'UNESCO Intangible Cultural Heritage', url: 'https://ich.unesco.org/en/RL/00282' }] }),
    ]));
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

  it('stages an editable preservation brief without saving or publishing it', async () => {
    const stagePlan = vi.fn();
    const tools = buildKurdishCalendarTools(dependencies({ stagePlan }));
    const stage = tools.find((tool) => tool.name === 'kurdish_calendar_stage_preservation_brief');
    const plan = {
      title: 'Nawroz across generations',
      purpose: 'Help diaspora children learn family traditions.',
      audience: 'Kurdish families in Toronto',
      languages: ['ku', 'en'],
      items: [{ date: '2026-03-21', time: '10:00', activity: 'Record a family Nawroz memory', note: 'Ask permission first' }],
      sourceUrls: ['https://ich.unesco.org/en/RL/00282'],
    };
    const result = await stage?.execute(plan);
    expect(stagePlan).toHaveBeenCalledWith(expect.objectContaining(plan));
    expect(result?.structuredContent).toMatchObject({
      status: 'draft', saved: false, published: false, consentRequired: true,
    });
    expect(tools.some((tool) => tool.name.includes('save') || tool.name.includes('publish'))).toBe(false);
  });

  it('registers seven tools with AbortSignal cleanup', () => {
    const signals: AbortSignal[] = [];
    const context: WebMcpModelContext = {
      registerTool: vi.fn(async (_tool, options) => signals.push(options.signal)),
    };
    const cleanup = registerKurdishCalendarTools(context, buildKurdishCalendarTools(dependencies()));
    expect(context.registerTool).toHaveBeenCalledTimes(7);
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
