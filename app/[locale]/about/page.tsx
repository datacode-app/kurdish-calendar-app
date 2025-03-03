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
  const navT = await getTranslations({ locale, namespace: 'nav' });
  const aboutT = await getTranslations({ locale, namespace: 'about' });
  
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl">{navT('about')}</CardTitle>
            <CardDescription>
              {navT('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                {aboutT('welcome')}
              </p>
              <p className="text-muted-foreground mt-4">
                {aboutT('developed')}
              </p>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium">{aboutT('features')}</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li className="text-muted-foreground">{aboutT('featuresList.multilanguage')}</li>
                  <li className="text-muted-foreground">{aboutT('featuresList.interactive')}</li>
                  <li className="text-muted-foreground">{aboutT('featuresList.details')}</li>
                  <li className="text-muted-foreground">{aboutT('featuresList.design')}</li>
                  <li className="text-muted-foreground">{aboutT('featuresList.darkmode')}</li>
                </ul>
              </div>
              
              <p className="text-muted-foreground mt-8">
                {aboutT('mission')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
