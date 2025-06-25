import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Configuração base do Next.js
const baseNextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // Especifique a porta do seu backend
        pathname: "/fotos/**",
      },
      {
        protocol: "https",
        hostname: "cdn2.thecatapi.com",
        port: "",
        pathname: "/images/**", // Permite qualquer caminho dentro de /images/
      },
      {
        protocol: "https",
        hostname: "cdn2.thedogapi.com",
        port: "",
        pathname: "/images/**", // Permite qualquer caminho dentro de /images/
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(baseNextConfig);
