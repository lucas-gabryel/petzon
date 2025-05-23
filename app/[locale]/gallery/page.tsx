import React from "react";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";

export default function Gallery() {
  const t = useTranslations("Gallery");

  return (
    <>
      <Typography variant="h1">{t("title")}</Typography>
      <Typography variant="h2">{t("about")}</Typography>
    </>
  );
}
