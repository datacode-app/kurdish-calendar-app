/* eslint-disable @typescript-eslint/no-unused-vars */
import { getTranslations } from 'next-intl/server';
import Navigation from '../../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  
  return {
    title: t('about'),
  };
}

export default async function AboutPage({ 
  params
}: { 
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl">{t('about')}</CardTitle>
            <CardDescription>
              {/* {t('description')} */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Welcome to the Kurdish Calendar – your definitive guide to celebrating Kurdish traditions and cultural milestones. This platform is dedicated to providing comprehensive insights into Kurdish holidays, festivals, and significant events that shape our vibrant heritage.
              </p>
              <p className="text-muted-foreground mt-4">
                Developed with passion and precision by the DataCode team, our calendar marries modern design with the rich cultural narrative of Kurdistan. We believe in harnessing innovative technology to honor tradition, creating a resource that not only informs but also inspires and connects communities.
              </p>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium">Key Features</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li className="text-muted-foreground">Multi-language support (Kurdish, Arabic, Persian, and English)</li>
                  <li className="text-muted-foreground">Interactive and real-time calendar updates</li>
                  <li className="text-muted-foreground">In-depth details on holidays and cultural events</li>
                  <li className="text-muted-foreground">User-centric design for a seamless experience across devices</li>
                  <li className="text-muted-foreground">Dark mode for enhanced viewing comfort</li>
                </ul>
              </div>
              
              <p className="text-muted-foreground mt-8">
                At DataCode, our mission is to blend cutting-edge technology with cultural authenticity. We are committed to delivering high-quality digital solutions that celebrate our heritage and empower communities. Join us on this journey as we continue to innovate, inspire, and preserve the rich legacy of Kurdish culture.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
