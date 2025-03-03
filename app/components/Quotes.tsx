/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fs } from 'fs';
import path from 'path';
import QuoteDisplay from './QuoteDisplay';
import { Holiday, Quote } from '@/types/holidays';

async function getQuotes() {
  try {
    // Read the holidays.json file
    const filePath = path.join(process.cwd(), 'public', 'holidays.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Extract quotes from holidays
    const quotes = data.holidays
      .filter((holiday: Holiday) => holiday.quote)
      .map((holiday: Holiday) => holiday.quote);
    
    // Get unique quotes based on celebrity and quote content
    const uniqueQuotes = Array.from(
      new Map(quotes.map((quote: Quote) => [quote.celebrity + JSON.stringify(quote.quote), quote])).values()
    );
    
    // Shuffle the quotes to get a random order
    return shuffleArray(uniqueQuotes);
  } catch (error) {
    console.error('Error loading quotes:', error);
    return [];
  }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function Quotes({ locale }: { locale: string }) {
  const quotes = await getQuotes();
  
  // If no quotes found, don't render anything
  if (!quotes.length) return null;
  
  return <QuoteDisplay quotes={quotes} locale={locale} />;
} 