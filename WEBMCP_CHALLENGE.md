# WebMCP Challenge submission draft

## Project

**Kurdish Cultural Memory — preserve living culture across borders and generations**

- Live application: https://calendar.krd
- Public source: https://github.com/datacode-app/kurdish-calendar-app
- License: MIT

## Why WebMCP fits

Kurdish communities live across Kurdistan and a worldwide diaspora. Preserving a family memory or organizing a cultural gathering can require several Kurdish varieties, four written interface languages, five calendar views, sourced cultural context, and coordination across distant time zones.

Ordinary browser navigation leaves the person to translate dates, search long event lists, check several clocks, collect trustworthy context, and reconstruct the result elsewhere. WebMCP exposes those domain concepts as explicit tools. The agent can do the repetitive comparison and preparation while the person remains responsible for cultural judgment, attribution, consent, and publication.

## Human-agent collaboration

The agent can:

1. inspect today across Gregorian, Kurdish Rojhalat, Kurdish Bashur, Persian, and Hijri calendars;
2. convert a supplied Gregorian date across those systems;
3. search multilingual Kurdish cultural events;
4. explore a sourced cultural-preservation archive for all Kurdish regions and the diaspora;
5. compare and rank gathering times across up to eight IANA time zones;
6. open the chosen date in the real calendar UI; and
7. stage a consent-first preservation brief for a family, school, or community.

The person sees the selected date and an editable brief containing its purpose, audience, languages, activities, sources, and consent reminder. No tool can save, publish, book, or send it.

## WebMCP implementation

The public site registers seven imperative tools through `document.modelContext.registerTool()`:

- `kurdish_calendar_get_today`
- `kurdish_calendar_convert_date`
- `kurdish_calendar_find_events`
- `kurdish_calendar_explore_heritage`
- `kurdish_calendar_compare_global_times`
- `kurdish_calendar_open_date`
- `kurdish_calendar_stage_preservation_brief`

Each tool has a strict JSON input schema, behavior annotations, structured output, and a short text result. Registrations use `AbortSignal`; synchronous or asynchronous partial-registration failures abort the complete set. Event search uses the same data as the visible calendar. Cultural entries carry source URLs, localized summaries, regional tags, themes, and preservation prompts.

## Existing project versus challenge work

Kurdish Calendar, its localization, date-conversion utilities, event data, and production site existed before the challenge.

Added during the challenge:

- seven WebMCP tool contracts and implementations;
- imperative registration and fail-closed lifecycle cleanup;
- agent-driven date navigation;
- sourced multilingual cultural-preservation records;
- international time-zone comparison and ranking;
- an editable, consent-first preservation review panel;
- explicit private/unsaved/human-control messaging;
- updated bundled event data through 2026;
- automated tests and WebMCP-capable desktop/mobile browser verification.

The feature branch history separates the challenge extension from the pre-existing application.

## Demo prompt

> Help Kurdish families in Erbil, London, Toronto, and Sydney preserve Nawroz together. Find sourced cultural context, compare 2026-03-21 at 13:00Z and 17:00Z, open March 21, and stage a Kurdish-English preservation brief for families to review. Include a consent-first prompt for recording one family memory.

## Testing

1. Use ChatGPT's in-app browser, or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled.
2. Open the live URL.
3. Confirm `await document.modelContext.getTools()` returns the seven tools.
4. Run the demo prompt.
5. Confirm March 21 is selected and the preservation brief is editable, sourced, consent-first, private, and unsaved.

Automated checks:

```bash
npm ci
npm test
npm run build
```

## Video plan

The final video will be a continuous recording of the deployed product, under three minutes, with English audio. It will show tool discovery, sourced heritage exploration, multilingual calendar context, global-time comparison, agent-driven date selection, and the editable consent-first preservation brief. No slideshow or mock-product footage will be used.
