import '~/styles/globals.css';

import { Toaster } from '~/components/ui/sonner';

import Providers from '../components/providers/providers';

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
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
