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
  webpack: (config, { isServer }) => {
    // A regra a seguir aplica-se apenas ao build do cliente (navegador)
    if (!isServer) {
      // O 'fallback' diz ao Webpack o que fazer quando não encontra um módulo.
      // Ao definir como 'false', ele simplesmente o ignora.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false, // Ignora o módulo 'net'
        tls: false, // É uma boa prática ignorar o 'tls' também, pois pode causar problemas semelhantes
      };
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(baseNextConfig);
