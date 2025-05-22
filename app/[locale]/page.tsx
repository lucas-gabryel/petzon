import React from "react";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations("Home");

  return (
    <>
      <h1>{t("title")}</h1>
      <p>{t("about")}</p>
    </>
  );
}
