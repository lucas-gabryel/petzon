"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation"; //
import { useTranslations } from "next-intl";

export default function NavBar() {
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/gallery", label: t("gallery") },
    { href: "/login", label: t("login") },
  ];

  return (
    <header className="bg-purple-700 text-white shadow-md">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo do Petzon"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-yellow-400">Petzon</span>
        </Link>
        <div className="flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-yellow-300 transition`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
