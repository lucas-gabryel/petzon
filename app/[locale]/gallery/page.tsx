import React from "react";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import MultiActionAreaCard from "../../components/multiActionAreaCard/MultiActionAreaCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Galeria'
};

export default function Gallery() {
  const t = useTranslations("gallery");

  return (
    <div className="m-8">
      <Typography variant="h4" gutterBottom>
        {t("previewTitle")}
      </Typography>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-center">
        <MultiActionAreaCard
          id="001"
          image="/cachorrinho.jpg"
          alt="cachorrinho"
          title={t("cards.um.title")}
          description={t("cards.um.text")}
        />
        <MultiActionAreaCard
          id="002"
          image="/gatinho.webp"
          alt="gatinho"
          title={t("cards.dois.title")}
          description={t("cards.dois.text")}
        />
      </div>
    </div>
  );
}
