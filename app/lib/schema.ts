import { Event } from '../types/event';

export function generateEventSchema(event: Event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date,
    endDate: event.date,
    location: {
      '@type': 'Place',
      name: 'Kurdistan',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Kurdistan'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'Kurdish Calendar',
      url: 'https://calendar.krd'
    },
    image: event.image || 'https://calendar.krd/og-image.jpg',
    inLanguage: ['en', 'ku', 'ar', 'fa'],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    virtualLocation: {
      '@type': 'VirtualLocation',
      url: 'https://calendar.krd'
    }
  };
}

export function generateCalendarSchema(events: Event[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kurdish Calendar Events',
    description: 'A comprehensive calendar of Kurdish events and holidays',
    url: 'https://calendar.krd/events',
    about: {
      '@type': 'Thing',
      name: 'Kurdish Culture',
      description: 'Cultural events and holidays in Kurdish tradition'
    },
    hasPart: events.map(event => ({
      '@type': 'ListItem',
      item: generateEventSchema(event)
    }))
  };
} 