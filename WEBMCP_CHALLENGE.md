# WebMCP Challenge submission draft

## Project

**Kurdish Calendar — an agent-ready cultural calendar**

- Live application: https://calendar.krd
- Public source: https://github.com/datacode-app/kurdish-calendar-app
- License: MIT

## Why WebMCP fits

Kurdish Calendar already brings Gregorian, Kurdish Rojhalat, Kurdish Bashur, Persian, and Hijri dates together with multilingual cultural-event data. That information is difficult for browser agents to use reliably through visual clicking alone: dates can look similar while representing different calendar systems, and the same event may be expressed in Sorani Kurdish, Arabic, Persian, or English.

WebMCP turns those domain concepts into explicit tools. A person can ask an agent to find culturally relevant dates, compare calendar representations, open the correct day in the visible calendar, and prepare an itinerary. The final plan appears in the ordinary product interface as an editable, unsaved draft.

## Human-agent collaboration

Before this integration, a person had to manually translate dates across calendar systems, browse monthly event lists, open individual dates, and assemble a plan elsewhere. With WebMCP, the agent performs the structured research and navigation while the person retains judgment and control.

The agent can:

1. inspect today's date across five calendar views;
2. convert a supplied Gregorian date;
3. search multilingual cultural events over a date range;
4. open and select a date in the real calendar UI; and
5. stage a cultural itinerary for review.

The agent cannot book, save, publish, or send the plan. The review panel explicitly labels it as an unsaved draft and lets the person edit or dismiss it.

## WebMCP implementation

The authenticated-free public site registers five imperative tools through `document.modelContext.registerTool()`:

- `kurdish_calendar_get_today`
- `kurdish_calendar_convert_date`
- `kurdish_calendar_find_events`
- `kurdish_calendar_open_date`
- `kurdish_calendar_stage_plan`

Each tool includes a JSON input schema, behavior annotations, structured output, and a short text result. Registrations use the standard `AbortSignal` lifecycle, and a partial registration failure aborts the whole set. Event search uses the same bundled/API dataset as the visible calendar.

## Existing project versus challenge work

Kurdish Calendar, its localization, date-conversion utilities, event data, and production site existed before the challenge.

Added during the challenge:

- the five WebMCP tool contracts and implementations;
- imperative registration and lifecycle cleanup;
- agent-driven navigation to a selected date;
- a visible, editable cultural-plan review panel;
- explicit unsaved/human-control messaging;
- current bundled event data through 2026;
- automated tests and WebMCP-capable browser verification.

The feature commit history documents the extension during the submission period.

## Demo prompt

> Find Kurdish cultural events around Nawroz 2026, open March 21 in the calendar, and stage a two-day cultural plan for me to review.

## Testing

1. Use ChatGPT's in-app browser, or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled.
2. Open the live URL.
3. Confirm `await document.modelContext.getTools()` returns the five tools.
4. Run the demo prompt.
5. Confirm March 21 is selected and the staged plan is visible, editable, and labeled unsaved.

Automated checks:

```bash
npm ci
npm test
npm run build
```

## Video plan

The final video will be a continuous recording of the live product, under three minutes, with English audio. It will show tool discovery, multilingual event search, cross-calendar context, agent-driven date selection, and the editable unsaved plan. No slideshows or mock-product footage will be used.
