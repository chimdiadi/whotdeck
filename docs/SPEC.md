# Prompt: TypeScript Whot Library with SVG Templates **or** Programmatic Renderer (Dynamic Card Number + Exact Suit Shapes)

You are an expert **TypeScript** library author and UI engineer. Produce a high-quality, portable library that **creates, manages, and renders** a complete **Whot** deck as specified below. Follow these instructions precisely and output:

1.  a production-ready TypeScript codebase,
2.  tests with high coverage,
3.  a polished `README.md`,
4.  build scripts for **dev** and **prod** including **minification** and **optional obfuscation**, and
5.  a `.bumpversion.cfg` for versioning.

Adhere strictly to **Google JavaScript Style Guide for TypeScript** ([https://google.github.io/styleguide/jsguide.html](https://google.github.io/styleguide/jsguide.html?utm_source=chatgpt.com)). Use TSDoc comments for all public APIs.

Build a portable, production-ready library that **creates, manages, and renders** a complete **Whot** deck. It must **either**:

1.  **Inline & use the uploaded SVG templates** (preferred when available), or
2.  **Render programmatically** with shapes that visually match those templates (“picture perfect”).

> **Templates (text-based numerals):**
>
> - `1-Star-text.svg` _(or `1-Start-text.svg` if that’s the file you have — handle either name)_
> - `1-Cross-Text.svg`
> - `1-Square-Text.svg`
> - `1-Circle-text.svg` _(handle `1-Circle-text.svg` and `1-circle-text.svg`)_
> - `1-Triangle-text.svg`
> - `Whot-text.svg`  
>   Each numbered template uses **text** numerals like:
>
> ```xml
> <text ...><tspan x="0" y="0">1</tspan></text>
>
> ```
>
> Replace **both corner “1”s** dynamically to produce other Card Numbers (2–14).  
> The **Whot** card uses a label (default “WHOT”), also rendered as text.

Deliverables:

1.  Complete **TypeScript** code (strict mode)
2.  **Unit tests** with high coverage
3.  A polished **README.md**
4.  **Build scripts** for dev/prod, **minification**, optional **obfuscation**
5.  **.bumpversion.cfg** for versioning
6.  **Example UI** (no heavy frameworks) demonstrating key features

Follow **Google JavaScript Style Guide for TypeScript**: [https://google.github.io/styleguide/jsguide.html](https://google.github.io/styleguide/jsguide.html). Use **TSDoc** for all public APIs.

---

## 1) Domain Model & Deck Rules

### Suits

`square | circle | triangle | star | cross | whot`

### Card Number

- Shown in **top-left** and **bottom-right** corners (for all numbered suits)
- Dynamic (replace the two `<tspan>1</tspan>` entries in the template)

### Deck Composition (single deck = 54 cards)

- **Circle**: 1,2,3,4,5,7,8,10,11,12,13,14 (12)
- **Triangle**: 1,2,3,4,5,7,8,10,11,12,13,14 (12)
- **Cross**: 1,2,3,5,7,10,11,13,14 (9)
- **Square**: 1,2,3,5,7,10,11,13,14 (9)
- **Star**: 1,2,3,4,5,7,8 (7)
- **Whot**: 5 identical cards (same suit “whot” + same label; default label “WHOT”) (5)

### IDs & Equality

- Each `Card` has a **stable unique id** `${suit}:${label}`; duplicates get `#N` suffix (e.g., `whot:WHOT#1..#5`).

---

## 2) Rendering Strategy (Templates **or** Programmatic)

Implement a pluggable renderer with two backends that share the same public API:

### A) **SvgTemplateBackend** (preferred)

- **Inline** the SVG template content for each suit (1-value variants + Whot) into `src/assets/` as **string constants**.
  - You **must** paste the exact contents of each uploaded file into constants.
  - Provide a small helper to **normalize filename variations** (`1-Star-text.svg` vs `1-Start-text.svg`, `1-Circle-text.svg` vs `1-circle-text.svg`) so the build is robust.

- **Parse** the SVG string to find the **two corner numerals** (top-left & bottom-right). They are expressed as `<text><tspan>1</tspan></text>`.
  - Replace the inner text value from `"1"` to the requested **Card Number** (string form).
  - Preserve `x`, `y`, `font-family`, `font-size`, and any transforms/styles.

- Ensure the **central suit symbol** and its colors/paths remain **unchanged**, so the rendering is **picture perfect** to the template (only the numerals change).
- For **Whot** cards, replace the corner text with the **Whot label** (`"WHOT"` by default, configurable).

### B) **ProgrammaticBackend** (fallback)

- Provide pure-TS **shape generators** that match the look of each template:  
  `renderCircleSymbol`, `renderTriangleSymbol`, `renderSquareSymbol`, `renderStarSymbol`, `renderCrossSymbol`, `renderWhotSymbol` → return `<g>...</g>` strings sized to fit the card.
- Use default **viewBox `0 0 75 100`** (or match the template’s) and replicate:
  - Rounded rectangle card body (border radius, stroke width)
  - Center symbol geometry (size, stroke/fill)
  - Corner text placement (top-left and bottom-right), including a **mini corner symbol** aligned with the number
  - Typography defaults (font family/size) matching the templates as closely as possible

- The programmatic results must be **visually indistinguishable** at normal viewing sizes.

### Selection

- Auto-select **SvgTemplateBackend** if template constants exist; otherwise use **ProgrammaticBackend**.
- Allow explicit override via options: `{ renderer: 'template' | 'programmatic' }`.

---

## 3) Public API

```ts
export type Suit = 'circle' | 'triangle' | 'square' | 'star' | 'cross' | 'whot';

export interface Card {
  id: string; // e.g., "circle:7" or "whot:WHOT#3"
  suit: Suit;
  label: string; // corner label ("1".."14", or "WHOT"/custom)
}

export interface DeckOptions {
  numDecks?: number; // default 1
  whotLabel?: string; // default "WHOT" (string; allow "20" or custom)
  randomSeed?: number | string; // seed for deterministic shuffle, optional
  theme?: Partial<WhotTheme>; // layout/typography/colors
  renderer?: 'template' | 'programmatic';
}

export interface WhotTheme {
  width: number;
  height: number; // default 75x100
  borderRadius: number;
  borderWidth: number; // defaults 6 / 1.5
  strokeColor: string;
  fillColor: string; // card border/background
  cornerFontFamily: string;
  cornerFontSize: number; // defaults system-ui / 8
  cornerInsetX: number;
  cornerInsetY: number; // default 7 / 11
  cornerSymbolSize: number; // default 10
  suitColors: Record<Suit, string>; // palette; Whot may be special
}

export interface RenderOptions {
  width?: number;
  height?: number;
  className?: string;
  dataAttrs?: Record<string, string>;
  asDom?: boolean; // return SVGElement if true (browser), else string
}

export interface DealOptions {
  players: number;
  cardsPerPlayer: number;
}

export class Deck {
  readonly cards: Card[];
  constructor(options?: DeckOptions);
  reset(): void;
  shuffle(): void; // Fisher–Yates; seeded if randomSeed provided
  draw(n?: number): Card[]; // removes from top
  deal(opts: DealOptions): Card[][]; // round-robin; throws if insufficient
  size(): number;
  toJSON(): string;
  static fromJSON(json: string): Deck;
}

export function renderCard(
  card: Card,
  opts?: RenderOptions & { theme?: Partial<WhotTheme> },
): string | SVGElement;
export function renderGrid(
  cards: Card[],
  cols: number,
  opts?: RenderOptions & { gap?: number },
): string | SVGElement;
```

**Accessibility:**  
Return `<svg role="img" aria-labelledby="title desc">` with `<title>${suit} ${label}</title>` and `<desc>Whot playing card with suit ${suit} and label ${label}</desc>`.

---

## 4) Assets Inlining (for SvgTemplateBackend)

- Create `src/assets/templates.ts` that **exports string constants**:

  ```ts
  export const SVG_STAR_1 = `... exact pasted contents of 1-Star-text.svg ...`;
  export const SVG_CROSS_1 = `... 1-Cross-Text.svg ...`;
  export const SVG_SQUARE_1 = `... 1-Square-Text.svg ...`;
  export const SVG_CIRCLE_1 = `... 1-Circle-text.svg ...`;
  export const SVG_TRIANGLE_1 = `... 1-Triangle-text.svg ...`;
  export const SVG_WHOT = `... Whot-text.svg ...`;
  ```

- If your local files use slightly different names (e.g., `1-Start-text.svg`, lowercase “circle”), normalize and paste those exact contents.
- **Do not rasterize** the numbers; they must remain as `<text><tspan>…</tspan></text>` to support dynamic replacement.
- Implement a utility that:
  - Parses the string to DOM/SAX or regex-safe XML processing
  - Locates **exactly two corner numerals** (two `<tspan>` with `"1"`); replaces inner text with the requested `label`
  - For bottom-right text, keep alignment/anchor from the template (don’t change attributes)
  - Leaves all suit paths/groups intact
  - Returns the modified SVG as a string (or DOM if `asDom`)

---

## 5) Behavior & Example UI

- Provide `examples/simple-ui` (Vite + TS) demonstrating:
  - New deck, shuffle, draw, deal
  - Choose **number of decks**
  - Change **Whot label** (e.g., “WHOT”, “20”)
  - Toggle **renderer**: template vs programmatic
  - Theme presets: light/dark/high-contrast
  - Export any rendered card’s SVG to a file

- Keep dependencies minimal (no React/Angular/Vue).

**Usage sample (document in README & include in example):**

```ts
import { Deck, renderCard } from '@acme/whot';

const deck = new Deck({ numDecks: 1, whotLabel: 'WHOT', randomSeed: 123, renderer: 'template' });
deck.shuffle();
const [card] = deck.draw();
const svg = renderCard(card, { width: 200, className: 'card' });
document.querySelector('#app')!.innerHTML = svg as string;
```

---

## 6) Behavior & Example UI

```
whot/
  ├─ src/
  │   ├─ index.ts
  │   ├─ deck.ts
  │   ├─ rng.ts
  │   ├─ render/
  │   │   ├─ svg.ts          # helpers for svg strings, attributes, mirroring, text anchoring
  │   │   ├─ layout.ts       # layout constants, theme defaults
  │   │   ├─ suit-symbols.ts # vector generators for suits
  │   │   └─ render-card.ts  # main card renderer
  │   └─ types.ts
  ├─ tests/
  │   ├─ deck.spec.ts
  │   ├─ render.spec.ts
  │   └─ rng.spec.ts
  ├─ examples/
  │   └─ simple-ui/ (Vite + TS)
  ├─ README.md
  ├─ package.json
  ├─ tsconfig.json
  ├─ .eslintrc.cjs
  ├─ .prettierrc.json
  ├─ rollup.config.mjs  (or tsup.config.ts)
  ├─ .bumpversion.cfg
  └─ LICENSE

```

---

## 7) Build & Tooling

- Language: **TypeScript** (strict)
- Lint: **ESLint** with `eslint-config-google` + `@typescript-eslint`
- Format: Prettier (bias toward Google style where conflicts)
- Bundler: **Rollup** or **tsup** to emit:
  - ESM + UMD bundles in `dist/`
  - Type declarations
  - Sourcemaps (dev)

- **Minification** in prod (Terser/esbuild)
- **Optional obfuscation** via `javascript-obfuscator` plugin (controlled by `OBFUSCATE=true`)

**package.json scripts:**

```json
{
  "type": "module",
  "scripts": {
    "clean": "rimraf dist",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "format": "prettier --write .",
    "test": "vitest run --coverage",
    "dev": "rollup -c --watch",
    "build:dev": "NODE_ENV=development rollup -c",
    "build:prod": "NODE_ENV=production ROLLUP_MINIFY=true rollup -c",
    "build:prod:obf": "NODE_ENV=production ROLLUP_MINIFY=true OBFUSCATE=true rollup -c",
    "example": "vite examples/simple-ui"
  }
}
```

---

## 8) Tests (Vitest + jsdom)

**Coverage targets:** Deck ≥95% statements/branches; Rendering ≥90%.

Write tests for:

- **Deck composition**
  - Single deck is **54** cards
  - Exact suit/number sets match the rules above
  - Exactly **5 Whot** per deck, identical label, ids `whot:LABEL#1..#5`
  - `numDecks = N` → `54*N`

- **Shuffle**
  - Same seed → same order; different seeds → different orders

- **Draw/Deal**
  - `draw(n)` removes `n` from top
  - `deal({players, cardsPerPlayer})` → equal subarrays; throw if insufficient cards

- **Serialization**
  - `toJSON()` ↔ `fromJSON()` round-trip

- **Rendering (Template backend)**
  - For each numbered suit, confirm **two corner `<tspan>`s** whose text equals the requested **Card Number**
  - Paths/groups count **unchanged** vs the base template (suit graphics untouched)
  - For **Whot**, both corners hold the **whotLabel**

- **Rendering (Programmatic backend)**
  - `<svg>` has correct viewBox; central `<g>` exists; two corner `<text>` blocks present
  - Visual metrics (bounding box/positions) within a small tolerance vs template

- **Theme**
  - Overrides for dimensions, fonts, inset, colors apply

- **Deck math & composition**
  - Single deck size is **54**.
  - Card sets match exact suit/number specification above.
  - Exactly **5 Whot** per deck with identical `label` and unique ids (#1..#5).
  - `numDecks = N` → total `54*N`.

- **Shuffling**
  - Different seeds produce different orders.
  - Same seed → same order (deterministic).
  - Unseeded → non-deterministic (hard to assert; just ensure size preserved).

- **Draw & deal**
  - `draw(n)` removes from top, returns `n` cards; errors if `n` invalid.
  - `deal({players, cardsPerPlayer})` returns `players` arrays of equal lengths, round-robin; throws on insufficient cards.

- **Serialization**
  - `toJSON()` and `fromJSON()` round-trip equality of deck state.

- **Rendering**
  - `renderCard` returns a valid `<svg…>` string by default.
  - Corner labels exist twice for numbered suits and for Whot (using whot label).
  - Suit `<g>` present and sized/colored per theme.
  - `renderGrid` creates a wrapping `<svg>` containing all children with correct count.

- **Theme**
  - Theme overrides for width/height/fonts/colors/layout apply correctly.
  - High-contrast preset passes minimal contrast checks for text vs. background.

Add type-level tests (tsd or similar) to validate exported types.

---

## 9) README.md (Professional)

Include:

- Overview & features
- Deck composition table
- Installation & quick start
- **Template vs programmatic** renderer explanation
- Theming guide
- Deterministic shuffle with seeds
- API reference (from TSDoc)
- Build targets (dev/prod), minification, obfuscation
- Versioning with **.bumpversion.cfg**
- License

---

## 10) Versioning

Provide `.bumpversion.cfg` that updates `package.json` and `src/version.ts`:

```
[bumpversion]
current_version = 0.1.0
commit = True
tag = True

[bumpversion:file:package.json]
search = "version": "{current_version}"
replace = "version": "{new_version}"

[bumpversion:file:src/version.ts]
search = export const VERSION = '{current_version}';
replace = export const VERSION = '{new_version}';

```

---

## 11) Acceptance Checklist

- TS code compiles with `strict`, passes ESLint (Google) + Prettier
- `npm run build:prod` minifies; `build:prod:obf` obfuscates
- `npm run test` passes with coverage targets
- Deck has exactly **54** cards; `numDecks` multiplies correctly
- **Whot**: 5 copies, identical label, ids `whot:LABEL#1..#5`
- **Template backend**: uses pasted SVGs; only corner `<tspan>` text changes
- **Programmatic backend**: visually matches templates at normal sizes
- `renderCard` returns accessible `<svg>`; corner numbers correct & mirrored
- Example app demonstrates deck ops, rendering, theme, export
- README and `.bumpversion.cfg` present and polished

---

**Important**:

- Prefer the **SvgTemplateBackend** whenever the pasted template strings exist; it guarantees **picture-perfect** fidelity.
- The **Card Number** must be **dynamic** by replacing **both** corner numerals’ `<tspan>` text.
- **Suit identity** comes from the central SVG shapes/colors/annotations (as in the provided files); do not alter those graphics.
