// pages/_app.js
// Ponto de entrada do Next.js — importa estilos globais e envolve todas as páginas

import "../styles/globals.css";

/**
 * Componente raiz do Next.js.
 * Toda página passa por aqui, o que permite manter estado global
 * e aplicar estilos / providers de forma centralizada.
 */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
