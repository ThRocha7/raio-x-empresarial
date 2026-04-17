export function scrollToTop(topRef) {
  setTimeout(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 50);
}
