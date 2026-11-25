/**
 * Pages a scroll-snap rail by one card, looping at either end the way the
 * Testimonials deck does: "next" on the last card returns to the first, and
 * "previous" on the first jumps to the last.
 *
 * The ends are read off the live scroll position rather than a card index, so
 * the loop holds whatever number of cards fit in view at the current width.
 */
export function scrollRail(rail: HTMLElement | null, delta: -1 | 1, fallbackCard = 0) {
  if (!rail) return;
  const card = rail.firstElementChild as HTMLElement | null;
  const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
  const step = (card?.offsetWidth ?? fallbackCard) + gap;

  // A couple of pixels of slack: snapping and sub-pixel widths rarely land
  // exactly on 0 or on the maximum.
  const max = rail.scrollWidth - rail.clientWidth;
  const atStart = rail.scrollLeft <= 2;
  const atEnd = rail.scrollLeft >= max - 2;

  if (delta > 0 && atEnd) {
    rail.scrollTo({ left: 0, behavior: "smooth" });
  } else if (delta < 0 && atStart) {
    rail.scrollTo({ left: max, behavior: "smooth" });
  } else {
    rail.scrollBy({ left: step * delta, behavior: "smooth" });
  }
}
