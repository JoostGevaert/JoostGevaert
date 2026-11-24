// <popup-link>: a glossary link that shows a card with the term's definition.
// Adapted from bedrock-docs (bedrock-engineer/bedrock-docs, src/components/popup-link.js).
//
//   <popup-link data-term="Title" data-definition="The gist."><a href="...">...</a></popup-link>
//
// src/plugins/remark-glossary.mjs writes this markup for glossary links in posts.
// One card serves the whole page and is each link's accessible description.
// - Mouse: hovering a link shows its card after 200 ms; a click navigates.
// - Keyboard: focus shows the card, Enter navigates, Escape closes it.
// - Touch or pen: the first tap shows the card instead of navigating; a second tap
//   on the same link, or the title in the card, navigates. A tap outside closes it.

const cardClasses =
  "fixed z-40 w-max max-w-card rounded-sm border border-line bg-surface px-3 py-2 text-ink-muted type-small";
const titleClasses =
  "mbe-0.5 block font-semibold text-ink underline decoration-1 underline-offset-3";

if (!customElements.get("popup-link")) {
  const card = document.createElement("div");
  card.className = cardClasses;
  card.id = "popup-card";
  card.hidden = true;
  const title = document.createElement("a");
  title.className = titleClasses;
  const body = document.createElement("span");
  card.append(title, body);

  let timer: ReturnType<typeof setTimeout> | undefined;
  let current: PopupLink | undefined; // the <popup-link> whose card is open
  let tapped: HTMLAnchorElement | undefined; // its link, when a tap opened the card
  let pointer: { link: HTMLAnchorElement | null; type: string } | undefined;
  const margin = 12;
  const gap = 6;

  const place = () => {
    const link = current?.link?.getClientRects()[0];
    if (!link) return;
    const size = card.getBoundingClientRect();
    const above = link.top - gap - size.height;
    const left = Math.min(link.left, window.innerWidth - margin - size.width);
    card.style.left = `${Math.max(margin, left)}px`;
    card.style.top = `${above < 72 ? link.bottom + gap : above}px`;
  };
  const hide = () => {
    clearTimeout(timer);
    tapped?.setAttribute("aria-expanded", "false");
    tapped = undefined;
    current = undefined;
    card.hidden = true;
  };
  const show = (popup: PopupLink, { tap = false } = {}) => {
    clearTimeout(timer);
    if (current !== popup) hide();
    current = popup;
    const { term, definition } = popup.dataset;
    const href = popup.link?.getAttribute("href") ?? "";
    title.textContent = term ?? "";
    title.hidden = !term;
    title.href = href;
    body.textContent = definition ?? "";
    if (tap && popup.link) {
      tapped = popup.link;
      tapped.setAttribute("aria-controls", card.id);
      tapped.setAttribute("aria-expanded", "true");
    }
    card.hidden = false;
    place();
  };
  const later = (next: () => void, delay: number) => {
    clearTimeout(timer);
    timer = setTimeout(next, delay);
  };
  const isMouse = (event: PointerEvent) => event.pointerType === "mouse";
  const linkOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest("a") : null;

  class PopupLink extends HTMLElement {
    constructor() {
      super();
      this.addEventListener("pointerenter", (event) => {
        if (isMouse(event)) later(() => this.link && show(this), 200);
      });
      this.addEventListener("pointerleave", (event) => {
        if (isMouse(event) && !tapped) later(hide, 150);
      });
      this.addEventListener("focusin", () => this.link && show(this));
      this.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget as Node | null)) hide();
      });
      // A click doesn't say which pointer made it everywhere, so its pointerdown does.
      this.addEventListener("pointerdown", (event) => {
        pointer = { link: linkOf(event.target), type: event.pointerType };
      });
      this.addEventListener("pointercancel", () => {
        pointer = undefined;
      });
      this.addEventListener("click", (event) => {
        const link = linkOf(event.target);
        const tap =
          pointer?.link === link && (pointer?.type === "touch" || pointer?.type === "pen");
        pointer = undefined;
        if (!tap || link !== this.link) return;
        if (tapped === link) {
          hide();
          return;
        }
        event.preventDefault();
        show(this, { tap: true });
      });
    }

    connectedCallback() {
      this.link?.setAttribute("aria-describedby", card.id);
    }

    get link(): HTMLAnchorElement | null {
      return this.querySelector("a");
    }
  }

  card.addEventListener("pointerenter", (event) => {
    if (isMouse(event)) clearTimeout(timer);
  });
  card.addEventListener("pointerleave", (event) => {
    if (isMouse(event) && !tapped) later(hide, 150);
  });
  card.addEventListener("focusout", (event) => {
    const next = event.relatedTarget as Node | null;
    if (current && !card.contains(next) && next !== current.link) hide();
  });
  // Closes the card for a same-page anchor, such as a term on the glossary page.
  card.addEventListener("click", (event) => {
    if (linkOf(event.target)) hide();
  });
  // pointerdown, not click: iOS Safari fires no click on plain text.
  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target as Node | null;
      if (current && !card.contains(target) && !current.contains(target)) hide();
    },
    { capture: true },
  );
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !current) return;
    if (card.contains(document.activeElement)) current.link?.focus();
    hide();
  });
  window.addEventListener("scroll", () => current && place(), { passive: true, capture: true });

  // Module scripts run after parsing, so <body> exists.
  document.body.append(card);
  customElements.define("popup-link", PopupLink);
}
