import Link from 'next/link';
import React from 'react';

// Reusable Components
interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

export default function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="hover:text-gray-100 transition-colors transform hover:scale-110 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-100"
    >
      {children}
    </Link>
  );
}