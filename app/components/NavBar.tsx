"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./languageSwitcher/LanguageSwitcher";
import { FiMenu, FiX } from "react-icons/fi";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") }, // Novo link adicionado
    { href: "/login", label: t("login") },
  ];

  const renderLinks = () => (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-yellow-300 transition hover:border-b"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="bg-purple-700 text-white shadow-md">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex flex-row justify-between">
          {/* Logo */}
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

          {/* Button for mobile menu */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {renderLinks()}
          <LanguageSwitcher />

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="flex flex-col gap-4 px-8 pt-4 md:hidden">
            {renderLinks()}
            <div className="flex gap-6 mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
