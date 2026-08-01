'use client';

import Link from 'next/link';
import { Instagram, Youtube, Facebook, Heart } from 'lucide-react';

const links = [
  { icon: Instagram, href: 'https://www.instagram.com/abhay_ethically/', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/@abhay_ethically?si=iXzDGzaeabDJLDkZ', label: 'YouTube' },
  { icon: Facebook, href: 'https://www.facebook.com/share/v/1FuxL9qhMt', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer className="border-t border-hack-green/20 bg-hack-panel/40 p-4 text-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="flex items-center gap-1 font-mono text-xs text-slate-500">
          <Heart className="h-3 w-3 text-hack-red" />
          Built by Abhay
        </p>
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-hack-green"
              aria-label={l.label}
            >
              <l.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{l.label}</span>
            </a>
          ))}
          <Link
            href="/resources"
            className="font-mono text-xs text-slate-400 hover:text-hack-green"
          >
            Resources
          </Link>
          <Link
            href="/feedback"
            className="font-mono text-xs text-slate-400 hover:text-hack-green"
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
