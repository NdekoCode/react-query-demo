import '~/styles/globals.css';

import Providers from './providers';

export const metadata = {
  title: "React Query Demo",

  description:
    "A demo application showcasing React Query with Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
