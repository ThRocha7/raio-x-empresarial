// pages/_document.js
// Customiza o HTML base gerado pelo Next.js (meta tags, lang, etc.)

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta tags de SEO e compartilhamento */}
        <meta
          name="description"
          content="Raio-X Empresarial — Descubra o potencial oculto da sua empresa em minutos."
        />
        <meta property="og:title" content="Raio-X Empresarial" />
        <meta
          property="og:description"
          content="Avalie sua empresa agora e descubra o que está travando o seu crescimento."
        />
        <meta name="theme-color" content="#0B1220" />
        {/* Favicon simples inline */}
        <link rel="icon" href="/logo-fav.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
