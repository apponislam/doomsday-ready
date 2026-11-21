'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconName } from '@/types';
import { Icon } from '@/components/icons/icon';
import { Brand } from '@/components/layout/brand';
import { PremiereCountdown } from '@/components/layout/premiere-countdown';

const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Movies', icon: 'film' },
  { href: '/plan', label: 'Rewatch Plan', icon: 'route' },
  { href: '/booking', label: 'Booking', icon: 'ticket' },
];

export function Sidebar() {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/movies';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      <Brand />

      <nav>
        <p className="nav-label">COMMAND CENTER</p>
        {links.map((link) => {
          const active = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <PremiereCountdown />
    </aside>
  );
}
