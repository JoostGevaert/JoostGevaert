/**
 * Hide-on-scroll header: hidden while the reader scrolls down, back as soon
 * as they scroll up. Pure state, so the rule can be tested without a page.
 */
export interface HeaderScroll {
  /** Last scroll position seen (px from the top). */
  y: number;
  /** Position where the scroll direction last reversed. */
  turn: number;
  /** Direction of the last movement. */
  down: boolean;
  hidden: boolean;
}

export const initialHeaderScroll = (y: number): HeaderScroll => ({
  y,
  turn: y,
  down: false,
  hidden: false,
});

/**
 * Next state after a scroll to `y`.
 *
 * - Within `top` px of the top (the header's own height) it always shows,
 *   so the page never opens on an empty strip.
 * - Further down, it hides after `tolerance` px of downward scrolling and
 *   shows again after `tolerance` px upward. The tolerance absorbs jitter
 *   from trackpads and rubber-band scrolling.
 */
export function nextHeaderScroll(
  state: HeaderScroll,
  y: number,
  top: number,
  tolerance = 8,
): HeaderScroll {
  if (y === state.y) return state;
  const down = y > state.y;
  const turn = down === state.down ? state.turn : state.y;
  if (y <= top) return { y, turn, down, hidden: false };
  const travelled = Math.abs(y - turn);
  const hidden = travelled >= tolerance ? down : state.hidden;
  return { y, turn, down, hidden };
}
