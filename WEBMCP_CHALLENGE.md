# WebMCP Challenge submission draft

## Project

**Kurdish Calendar Agent — coordinate important dates across calendars and countries**

- Live application: https://calendar.krd/en/calendar
- Public source: https://github.com/datacode-app/kurdish-calendar-app
- License: MIT

## Why WebMCP fits

A Kurdish family or community may use several calendar systems and live across distant time zones. Planning Nawroz normally means searching an event list, translating its date between calendars, checking several local clocks, and then rebuilding the result in a message or calendar entry.

WebMCP turns those existing calendar capabilities into explicit, validated browser tools. An agent can perform the repetitive search and comparison accurately, update the real calendar interface, and prepare one event plan. The person verifies the visible date, edits the plan, and decides whether to copy or share it.

This is better than generic UI automation: the agent receives structured event records, calendar conversions, and time-zone results instead of scraping labels and guessing which controls to click.

## Human-agent collaboration

The agent can:

1. find Kurdish events within a date range;
2. convert a Gregorian date across Kurdish Rojhalat, Kurdish Bashur, Persian, and Hijri calendars;
3. compare candidate UTC times across up to eight IANA time zones;
4. open the chosen date in the visible calendar; and
5. stage an editable event plan with the conversions and local times.

The person sees the selected date and reviews the event title, time, calendar equivalents, city-by-city local times, and notes. No tool can save, share, send, publish, or book anything.

## WebMCP implementation

The public site registers five imperative tools through `document.modelContext.registerTool()`:

- `kurdish_calendar_convert_date`
- `kurdish_calendar_find_events`
- `kurdish_calendar_compare_global_times`
- `kurdish_calendar_open_date`
- `kurdish_calendar_stage_event_plan`

Each tool has a strict JSON input schema, honest behavior annotations, structured output, and a concise text result. Registrations share an `AbortSignal`; synchronous or asynchronous partial-registration failures abort the complete set. Event search uses the same dataset as the visible calendar. UI-affecting tools select the real date and stage the real editable review panel.

## Existing project versus challenge work

Kurdish Calendar, its localization, conversion utilities, event data, and production site existed before the challenge.

Added during the challenge:

- native WebMCP tool contracts and implementations;
- imperative registration and fail-closed lifecycle cleanup;
- agent-driven date navigation;
- international time-zone comparison and ranking;
- an editable, private event-plan review panel;
- explicit human-control messaging;
- updated bundled event data through 2026;
- automated tests and WebMCP-capable desktop/mobile browser verification.

The commit history separates the challenge extension from the pre-existing application.

## Demo prompt

> Plan Nawroz 2026 for my family in Erbil, London, and Toronto. Find the event, convert March 21 across the calendars shown here, compare 13:00Z and 20:00Z, open the correct date, and stage the best event plan for me to review. Do not save or share anything.

## Expected result

- The agent finds Nawroz on March 21, 2026.
- It returns the date in all five displayed calendar views.
- It compares both candidate times across the three locations.
- It opens March 21 in the real calendar UI.
- It stages an editable plan showing the chosen instant and each local time.
- The plan remains private and unsaved until the person explicitly copies it.

## Testing

1. Use ChatGPT's in-app browser, or Chrome with `chrome://flags/#enable-webmcp-testing` enabled.
2. Open the live URL.
3. Confirm `await document.modelContext.getTools()` returns the five tools.
4. Run the demo prompt.
5. Confirm March 21 is selected and the event plan is editable, private, and unsaved.

Automated checks:

```bash
npm ci
npm test
npm run build
```

## Video plan

The final video will be a continuous recording of the deployed product, under three minutes, with English audio. It will visibly show the user request, native tool discovery and execution, March 21 selected in the live calendar, the Nawroz event, cross-calendar and cross-time-zone results, and the editable event plan. No slideshow or preservation-story detour will be used.
