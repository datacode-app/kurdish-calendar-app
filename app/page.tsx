import { redirect } from 'next/navigation';
import { defaultLocale } from '../config';

export default function RootPage() {
  // console.log('Redirecting to default locale:', defaultLocale);
  return redirect(`/${defaultLocale}`);
}
