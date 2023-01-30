'use client';
import dynamic from 'next/dynamic';

import { Providers } from './providers';
import { GlobalStyle } from './GlobalStyle';

const CoreLayout = dynamic(() => import('./CoreLayout').then((mod) => mod.CoreLayout));

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalStyle />
      <html lang="en">
        <body>
          <Providers>
            <CoreLayout>{children}</CoreLayout>
          </Providers>
        </body>
      </html>
    </>
  );
}
