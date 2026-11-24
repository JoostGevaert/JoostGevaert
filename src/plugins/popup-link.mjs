// The markup src/scripts/popup-link.ts shows a card for: a link wrapped in
//   <popup-link data-term="Title" data-definition="The gist."><a href="...">...</a></popup-link>
// Adapted from bedrock-docs (bedrock-engineer/bedrock-docs, src/plugins/popup-link.mjs).
// The classes give the link inside a dotted underline and a help cursor.
export const popupLinkTag = "popup-link";

const classNames = [
  "*:underline",
  "*:decoration-dotted",
  "*:decoration-1",
  "*:underline-offset-3",
  "*:cursor-help",
];

// The element's properties, as mdast hProperties.
export const popupLinkProperties = ({ term, definition }) => ({
  className: [...classNames],
  dataTerm: term,
  dataDefinition: definition,
});
