import Navigation from '../components/Navigation';
import ClientComponentsWrapper from '../components/ClientComponentsWrapper';
import Quotes from '../components/Quotes';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'app' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        {/* Render client-only dynamic components via a client wrapper */}
        <ClientComponentsWrapper locale={locale} />
        
        {/* Quotes Section (can remain as a server component if no client-only logic is needed) */}
        <section className="py-4">
          <Quotes locale={locale} />
        </section>
      </div>
    </main>
  );
}
