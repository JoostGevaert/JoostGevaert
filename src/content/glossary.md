---
title: Glossary
description: The web-development words this blog uses, each with one plain meaning. Posts link here; hovering or tapping a link shows the definition.
---

Every term here keeps one meaning across the blog. Where a post links a term, hovering, focusing or tapping the link shows the first paragraph under its heading. On a phone, tap it again to come here.

## Working with an agent

### Coding agent (agent)

An AI assistant that works inside your project instead of only chatting about it: it reads your files, runs commands and writes code. Claude Code and Codex are examples. It is fast and tireless, but it only knows what is in front of it.

### AGENTS.md

A plain-text file at the top of a project that tells a coding agent how this project works: where things are, which rules to follow, which commands to run. Agents read it at the start of every session, so it's where you write down a correction once instead of repeating it.

### Repository (repo)

The folder that holds all of a project's files together with their full history, so every change can be seen and undone. This site's repository is on GitHub, where anyone (and any agent) can read it.

### Markdown

A way of writing formatted text with plain characters: `#` for a heading, `**bold**`, `-` for a list item. People read it fine as it is, and agents read and write it easily, which makes it the natural format for rules and documentation.

## Design

### Design system

The written-down answer to "what does this look like, and why?": the logo, fonts, colors, spacing and the rules for using them, kept in files. A style guide that both people and software can follow.

### Design token (token)

A named value in a design system, like `teal-10` for one shade of teal or `space-4` for one step of spacing. Code uses the name, never the raw value, so changing the token changes it everywhere at once.

### JSON

A plain-text format for structured data: names and values in curly braces, like `{ "name": "teal-10", "usage": "links" }`. Easy for programs to read, and still readable for people.

### Light and dark mode (dark mode)

Two color versions of the same site: dark text on a light background, or light text on a dark one. Most phones and computers have a system setting for it, and a good site follows that setting unless you choose otherwise.

### OKLCH

A way of writing a color as lightness, chroma (how colorful) and hue (which color). Unlike hex codes, equal steps in its numbers look like equal steps to the eye, which makes it good for building scales of one color.

## Building web pages

### HTML

The language a web page's content is written in: headings, paragraphs, links, buttons. The browser reads it to know what is on the page.

### CSS

The language that tells a browser how the HTML should look: colors, fonts, sizes, spacing and layout. Every visual rule of a site ends up as CSS.

### Tailwind CSS (Tailwind)

A way of writing CSS as short class names right in the HTML, like `text-ink` or `p-4`, instead of in a separate stylesheet. Its classes can be generated from your own tokens, so the only values available are the ones in your design system.

### Component

A reusable piece of a page, like a post card, a figure or the theme switch, written once and used in many places. Fix it once and it's fixed everywhere it appears.

### Breakpoint

A screen width at which a layout switches, such as from one column on a phone to three on a laptop. Fewer breakpoints means fewer layouts to test.

### Container query

A rule that lets a component adapt to the space it is given, instead of to the width of the whole screen. A chart in a narrow column and the same chart full width can each look right.

### Accessibility

Making a site work for everyone: people using a keyboard or a screen reader, people with low vision or color blindness, people on a small phone in bright sunlight. Most of it is small rules applied every time.

### Linter (lint)

A program that reads code and flags anything that breaks the project's rules, before the code goes live. An agent runs it too, so a broken rule gets fixed instead of shipped.

### Build

The step that turns a project's source files into the finished website: it checks the code, compiles the CSS and writes the pages. If a check fails, the build stops and nothing goes live.

### Self-hosting (self-hosted)

Serving a file, such as a font, from your own site instead of loading it from someone else's server. Nothing about your visitors goes to a third party.
