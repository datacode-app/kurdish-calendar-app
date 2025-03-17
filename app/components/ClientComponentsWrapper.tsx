'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
// import KurdishRegionsTime from './KurdishRegionsTime';

// Dynamically import client-only components with SSR disabled.
const Calendar = dynamic(() => import('./Calendar'), { ssr: false });
const MultiCalendarDisplay = dynamic(() => import('./MultiCalendarDisplay'), { ssr: false });
// const CityTimeDisplay = dynamic(() => import('./CityTimeDisplay'), { ssr: false });
const KurdishRegionsTime = dynamic(() => import('./KurdishRegionsTime'), { ssr: false });
export default function ClientComponentsWrapper({ locale }: { locale: string }) {
  return (
    <>
      <section className="py-4">
        <MultiCalendarDisplay locale={locale} />
      </section>
      <section className="py-4">
          <KurdishRegionsTime locale={locale} />
        </section>
      {/* <div className="mx-auto">
        <CityTimeDisplay locale={locale} />
      </div> */}
      <Card className="mx-auto">
        <CardContent className="p-4 md:p-6">
          <Calendar locale={locale} />
        </CardContent>
      </Card>
    </>
  );
}
