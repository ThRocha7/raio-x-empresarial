// pages/_document.js
// Customiza o HTML base gerado pelo Next.js (meta tags, lang, etc.)

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta tags de SEO e compartilhamento */}
        <meta name="description" content="Raio-X Empresarial — Descubra o potencial oculto da sua empresa em minutos." />
        <meta property="og:title" content="Raio-X Empresarial" />
        <meta property="og:description" content="Avalie sua empresa agora e descubra o que está travando o seu crescimento." />
        <meta name="theme-color" content="#0B1220" />
        {/* Favicon simples inline */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔍</text></svg>" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
