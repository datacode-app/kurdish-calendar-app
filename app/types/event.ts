export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  type: 'holiday' | 'cultural' | 'religious' | 'national';
  region?: 'rojhalat' | 'bashur' | 'bakur' | 'rojava';
  translations: {
    [key: string]: {
      title: string;
      description: string;
    };
  };
  isRecurring: boolean;
  recurrenceRule?: string;
  startTime?: string;
  endTime?: string;
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  category: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
} 