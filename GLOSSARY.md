# Glossary

## Core Terms

### Whot
A popular Nigerian card game that uses a unique deck of 54 cards with six suits. The game is similar to Crazy Eights or Uno but with its own distinct rules and card composition.

### Deck
A complete set of Whot cards containing exactly 54 cards with specific suit distribution. The library supports creating single or multiple decks.

### Card
An individual playing card with a suit, number/label, and unique identifier. Each card belongs to one of six suits and has a specific numeric value or special label.

### Suit
One of six categories that cards belong to:
- **Circle**: 12 cards (numbers 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14)
- **Triangle**: 12 cards (numbers 1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14)
- **Square**: 9 cards (numbers 1, 2, 3, 5, 7, 10, 11, 13, 14)
- **Cross**: 9 cards (numbers 1, 2, 3, 5, 7, 10, 11, 13, 14)
- **Star**: 7 cards (numbers 1, 2, 3, 4, 5, 7, 8)
- **Whot**: 5 identical cards (default label: "WHOT")

### Card Number
The numeric value displayed on a card (1-14). Note that Whot cards use numbers 6 and 9 are not used in the traditional deck.

### Whot Label
The text displayed on Whot cards. Defaults to "WHOT" but can be customized (e.g., "20" for some regional variants).

## Rendering Terms

### Template Backend
A rendering system that uses pre-designed SVG templates for pixel-perfect card reproduction. The backend dynamically replaces corner text while preserving all suit graphics and styling.

### Programmatic Backend
A rendering system that generates SVG cards programmatically using vector primitives. Offers maximum flexibility for customization but may differ slightly from original templates.

### SVG Template
A pre-designed SVG file containing the visual layout of a card suit. Templates include placeholder text (`<tspan>1</tspan>`) that gets replaced with actual card numbers.

### Theme
A configuration object that defines visual properties of rendered cards including colors, dimensions, fonts, and positioning.

### ViewBox
The coordinate system used in SVG rendering. The library uses a default viewBox of `0 0 75 100` for consistent card proportions.

## Technical Terms

### Seeded RNG
A random number generator that produces deterministic sequences based on a seed value. Allows for reproducible shuffling and testing.

### Fisher-Yates Shuffle
An algorithm for randomly shuffling arrays. Used by the library to shuffle decks while maintaining statistical randomness.

### Deterministic
A process that produces the same output given the same input. Seeded shuffling is deterministic - the same seed always produces the same shuffle order.

### Serialization
The process of converting a deck's state to a string format (JSON) for storage or transmission. Allows saving and restoring deck state.

### Accessibility
Features that make the library usable by people with disabilities. Includes ARIA attributes, screen reader support, and proper semantic markup.

## Game Terms

### Draw
To take one or more cards from the top of the deck. Cards are removed from the deck when drawn.

### Deal
To distribute cards to multiple players in a round-robin fashion. Each player receives the specified number of cards.

### Hand
A collection of cards held by a single player. Created by dealing cards from the deck.

### Reset
To restore the deck to its initial state with all cards present and in their original order.

### Shuffle
To randomize the order of cards in the deck using a shuffling algorithm.

## Library-Specific Terms

### Backend Selection
The process of choosing between template and programmatic rendering systems. Can be automatic or explicitly specified.

### Grid Rendering
A feature that renders multiple cards in a grid layout with configurable columns and spacing.

### Corner Text
The numeric value or label displayed in the top-left and bottom-right corners of each card.

### Suit Symbol
The graphical representation of a suit (circle, triangle, square, star, cross, or whot symbol) displayed in the center of the card.

### Bundle Size
The total size of the compiled library code. Template backend has larger bundle size due to inline SVG templates.

### Minification
The process of reducing code size by removing unnecessary characters while preserving functionality.

### Obfuscation
The process of making code harder to read while maintaining functionality. Optional feature for production builds.

## File Organization Terms

### Entry Point
The main file (`index.ts`) that exports the public API of the library.

### Module
A TypeScript file that exports functionality for use by other parts of the library.

### Asset
Static resources like SVG templates that are bundled with the library.

### Configuration
Files that define how the library is built, tested, and formatted.

### Declaration Files
TypeScript `.d.ts` files that provide type information for the compiled JavaScript code.

## Testing Terms

### Unit Test
A test that verifies the behavior of individual functions or classes in isolation.

### Integration Test
A test that verifies how multiple components work together.

### Coverage
A measure of how much of the code is executed during testing, expressed as a percentage.

### Test Environment
The runtime environment used for testing (jsdom for DOM testing in Node.js).

### Assertion
A statement that verifies expected behavior in a test (e.g., "expect deck size to be 54").
