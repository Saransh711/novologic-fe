import type { Metadata, Viewport } from 'next';
import './globals.css';
import { app } from '@/config';
import { ThemeStyle } from '@/design/ThemeStyle';
import { UiProviders } from '@/components/providers/UiProviders';
import { ApolloWrapper } from '@/lib/apollo/ApolloWrapper';
import { themeInitScript } from '@/lib/theme';

export const metadata: Metadata = {
  title: { default: app.name, template: `%s · ${app.shortName}` },
  description: app.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1120' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyle />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-bg text-foreground">
        <ApolloWrapper>
          <UiProviders>{children}</UiProviders>
        </ApolloWrapper>
      </body>
    </html>
  );
}
