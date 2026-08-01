import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandPalette from '@/components/CommandPalette';
import NameModal from '@/components/NameModal';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HackLab — Cybersecurity CTF',
  description: 'A gamified, client-side Capture The Flag platform for cybersecurity training.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="min-h-screen bg-hack-bg font-mono text-slate-200">
        <Header />
        <CommandPalette />
        <NameModal />
        <main className="h-[calc(100vh-56px)] overflow-y-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
