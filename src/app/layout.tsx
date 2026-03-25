import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { I18nProvider } from '@/lib/i18n-context';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'EduIgnite | School Management System',
  description: 'The future of institutional management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-secondary selection:text-secondary-foreground">
        <I18nProvider>
          <FirebaseClientProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </FirebaseClientProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
