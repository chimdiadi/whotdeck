/**
 * Default theme configuration for Whot cards.
 */
const DEFAULT_THEME = {
    width: 75,
    height: 100,
    borderRadius: 6,
    borderWidth: 0,
    strokeColor: '#640d0d',
    fillColor: '#ffffff',
    cornerFontFamily: 'system-ui, -apple-system, sans-serif',
    cornerFontSize: 8,
    cornerInsetX: 7,
    cornerInsetY: 11,
    cornerSymbolSize: 10,
    suitColors: {
        circle: '#640d0d',
        triangle: '#640d0d',
        square: '#640d0d',
        star: '#640d0d',
        cross: '#640d0d',
        whot: '#640d0d',
    },
};
/**
 * Card composition rules for Whot deck.
 */
const DECK_COMPOSITION = {
    circle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
    triangle: [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
    cross: [1, 2, 3, 5, 7, 10, 11, 13, 14],
    square: [1, 2, 3, 5, 7, 10, 11, 13, 14],
    star: [1, 2, 3, 4, 5, 7, 8],
    whot: [], // Whot cards are handled separately
};
/**
 * Number of Whot cards per deck.
 */
const WHOT_CARDS_PER_DECK = 5;
/**
 * Default Whot label.
 */
const DEFAULT_WHOT_LABEL = 'WHOT';
/**
 * Merge theme with defaults.
 */
function mergeTheme(partial) {
    if (!partial) {
        return { ...DEFAULT_THEME };
    }
    return {
        ...DEFAULT_THEME,
        ...partial,
        suitColors: {
            ...DEFAULT_THEME.suitColors,
            ...partial.suitColors,
        },
    };
}

/**
 * Simple seeded random number generator using xorshift algorithm.
 */
class SeededRNG {
    constructor(seed) {
        this.state = this.hashSeed(seed);
    }
    /**
     * Hash a seed string or number to a 32-bit integer.
     */
    hashSeed(seed) {
        if (typeof seed === 'number') {
            return Math.floor(seed) & 0xffffffff;
        }
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash + char) & 0xffffffff;
        }
        return hash;
    }
    /**
     * Generate next random number using xorshift algorithm.
     */
    next() {
        this.state ^= this.state << 13;
        this.state ^= this.state >>> 17;
        this.state ^= this.state << 5;
        return (this.state >>> 0) / 0x100000000;
    }
    /**
     * Generate random integer between min (inclusive) and max (exclusive).
     */
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }
    /**
     * Shuffle an array using Fisher-Yates algorithm.
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}
/**
 * Create a random number generator with optional seed.
 */
function createRNG(seed) {
    if (seed === undefined) {
        return null;
    }
    return new SeededRNG(seed);
}

/**
 * Represents a deck of Whot cards.
 */
class Deck {
    /**
     * Create a new deck of Whot cards.
     */
    constructor(options = {}) {
        this.options = {
            numDecks: options.numDecks ?? 1,
            whotLabel: options.whotLabel ?? DEFAULT_WHOT_LABEL,
            randomSeed: options.randomSeed ?? undefined,
            theme: options.theme ?? undefined,
            renderer: options.renderer ?? 'template',
        };
        this.rng = createRNG(this.options.randomSeed);
        this.cards = [];
        this.reset();
    }
    /**
     * Reset the deck to its initial state.
     */
    reset() {
        this.cards.length = 0;
        // Create cards for each deck
        for (let deckIndex = 0; deckIndex < this.options.numDecks; deckIndex++) {
            // Add numbered cards for each suit
            for (const [suit, numbers] of Object.entries(DECK_COMPOSITION)) {
                if (suit === 'whot')
                    continue; // Whot cards are handled separately
                for (const number of numbers) {
                    this.cards.push({
                        id: `${suit}:${number}${deckIndex > 0 ? `#${deckIndex + 1}` : ''}`,
                        suit: suit,
                        label: number.toString(),
                    });
                }
            }
            // Add Whot cards
            for (let i = 0; i < WHOT_CARDS_PER_DECK; i++) {
                this.cards.push({
                    id: `whot:${this.options.whotLabel}#${deckIndex * WHOT_CARDS_PER_DECK + i + 1}`,
                    suit: 'whot',
                    label: this.options.whotLabel,
                });
            }
        }
    }
    /**
     * Shuffle the deck using Fisher-Yates algorithm.
     */
    shuffle() {
        if (this.rng) {
            // Use seeded RNG for deterministic shuffling
            this.cards.splice(0, this.cards.length, ...this.rng.shuffle(this.cards));
        }
        else {
            // Use built-in Math.random for non-deterministic shuffling
            for (let i = this.cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
            }
        }
    }
    /**
     * Draw cards from the top of the deck.
     */
    draw(n = 1) {
        if (n < 0 || n > this.cards.length) {
            throw new Error(`Cannot draw ${n} cards from deck of size ${this.cards.length}`);
        }
        return this.cards.splice(0, n);
    }
    /**
     * Deal cards to multiple players.
     */
    deal(opts) {
        const { players, cardsPerPlayer } = opts;
        const totalCards = players * cardsPerPlayer;
        if (totalCards > this.cards.length) {
            throw new Error(`Cannot deal ${totalCards} cards to ${players} players from deck of size ${this.cards.length}`);
        }
        const hands = Array.from({ length: players }, () => []);
        // Deal cards round-robin
        for (let i = 0; i < totalCards; i++) {
            const playerIndex = i % players;
            const card = this.cards.shift();
            hands[playerIndex].push(card);
        }
        return hands;
    }
    /**
     * Get the current size of the deck.
     */
    size() {
        return this.cards.length;
    }
    /**
     * Check if the deck is empty.
     */
    isEmpty() {
        return this.cards.length === 0;
    }
    /**
     * Get the total number of cards in a full deck.
     */
    getFullDeckSize() {
        return ((Object.values(DECK_COMPOSITION)
            .filter(numbers => numbers.length > 0)
            .reduce((sum, numbers) => sum + numbers.length, 0) +
            WHOT_CARDS_PER_DECK) *
            this.options.numDecks);
    }
    /**
     * Convert deck to JSON string.
     */
    toJSON() {
        return JSON.stringify({
            cards: this.cards,
            options: this.options,
        });
    }
    /**
     * Create a deck from JSON string.
     */
    static fromJSON(json) {
        const data = JSON.parse(json);
        const deck = new Deck(data.options);
        deck.cards.splice(0, deck.cards.length, ...data.cards);
        return deck;
    }
    /**
     * Get deck options.
     */
    getOptions() {
        return { ...this.options };
    }
    /**
     * Get a copy of the current cards without modifying the deck.
     */
    getCards() {
        return [...this.cards];
    }
    /**
     * Add cards to the deck.
     */
    addCards(cards) {
        this.cards.push(...cards);
    }
    /**
     * Remove specific cards from the deck.
     */
    removeCards(cardIds) {
        const removed = [];
        const remaining = [];
        for (const card of this.cards) {
            if (cardIds.includes(card.id)) {
                removed.push(card);
            }
            else {
                remaining.push(card);
            }
        }
        this.cards.splice(0, this.cards.length, ...remaining);
        return removed;
    }
    /**
     * Find a card by its ID.
     */
    findCard(cardId) {
        return this.cards.find(card => card.id === cardId);
    }
    /**
     * Check if the deck contains a specific card.
     */
    hasCard(cardId) {
        return this.cards.some(card => card.id === cardId);
    }
}

/**
 * SVG template for Circle suit (number 1).
 * Exact contents from 1-Circle-text.svg
 */
const SVG_CIRCLE_1 = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.46 105.22"><defs><style>.cls-1{fill:#fff;stroke:#231f20;stroke-width:.46px;}.cls-2,.cls-3{fill:#640d0d;}.cls-3{font-family:ClarendonBT-Black, 'Clarendon Blk BT';font-size:12px;font-weight:800;}</style></defs><g id="Layer_1-2"><path class="cls-1" d="M6.18.23h63.1c3.29,0,5.95,2.67,5.95,5.95v92.86c0,3.29-2.67,5.95-5.95,5.95H6.18c-3.29,0-5.95-2.67-5.95-5.95V6.18C.23,2.89,2.89.23,6.18.23Z"/><circle class="cls-2" cx="37.73" cy="52.61" r="20.8"/><text class="cls-3" transform="translate(5.21 12.38)"><tspan x="0" y="0">1</tspan></text><circle class="cls-2" cx="9.16" cy="18.88" r="5.06"/><text class="cls-3" transform="translate(70.21 92.94) rotate(-180)"><tspan x="0" y="0">1</tspan></text><circle class="cls-2" cx="66.26" cy="86.34" r="5.06"/></g></svg>`;
/**
 * SVG template for Cross suit (number 1).
 * Exact contents from 1-Cross-text.svg
 */
const SVG_CROSS_1 = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.46 105.22"><defs><style>.cls-1{fill:none;}.cls-2{fill:#fff;stroke:#231f20;stroke-width:.46px;}.cls-3,.cls-4{fill:#640d0d;}.cls-4{font-family:ClarendonBT-Black, 'Clarendon Blk BT';font-size:12px;font-weight:800;}</style></defs><g id="Layer_1-2"><path class="cls-2" d="M6.18.23h63.1c3.29,0,5.95,2.67,5.95,5.95v92.86c0,3.29-2.67,5.95-5.95,5.95H6.18c-3.29,0-5.95-2.67-5.95-5.95V6.18C.23,2.89,2.89.23,6.18.23Z"/><text class="cls-4" transform="translate(5.21 12.38)"><tspan x="0" y="0">1</tspan></text><text class="cls-4" transform="translate(70.22 92.94) rotate(-180)"><tspan x="0" y="0">1</tspan></text><rect class="cls-1" x="32.46" y="31.81" width="10.18" height="41.53"/><polygon class="cls-3" points="32.64 57.71 32.64 73.38 42.82 73.38 42.82 57.71 42.82 57.7 58.5 57.7 58.5 47.52 42.82 47.52 42.82 47.51 42.82 31.84 32.64 31.84 32.64 47.51 32.64 47.52 16.96 47.52 16.96 57.7 32.64 57.7 32.64 57.71"/><polygon class="cls-3" points="7.91 20.13 7.91 23.94 10.39 23.94 10.39 20.13 10.39 20.13 14.2 20.13 14.2 17.66 10.39 17.66 10.39 17.66 10.39 13.84 7.91 13.84 7.91 17.66 7.91 17.66 4.1 17.66 4.1 20.13 7.91 20.13 7.91 20.13"/><polygon class="cls-3" points="65.02 87.68 65.02 91.5 67.5 91.5 67.5 87.68 67.5 87.68 71.32 87.68 71.32 85.2 67.5 85.2 67.5 85.19 67.5 81.38 65.02 81.38 65.02 85.19 65.02 85.2 61.2 85.2 61.2 87.68 65.02 87.68 65.02 87.68"/></g></svg>`;
/**
 * SVG template for Square suit (number 1).
 * Exact contents from 1-Square-text.svg
 */
const SVG_SQUARE_1 = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.46 105.22"><defs><style>.cls-1{fill:#fff;stroke:#231f20;stroke-width:.46px;}.cls-2,.cls-3{fill:#640d0d;}.cls-3{font-family:ClarendonBT-Black, 'Clarendon Blk BT';font-size:12px;font-weight:800;}</style></defs><g id="Layer_1-2"><path class="cls-1" d="M6.18.23h63.1c3.29,0,5.95,2.67,5.95,5.95v92.86c0,3.29-2.67,5.95-5.95,5.95H6.18c-3.29,0-5.95-2.67-5.95-5.95V6.18C.23,2.89,2.89.23,6.18.23Z"/><rect class="cls-2" x="17" y="31.88" width="41.46" height="41.46"/><text class="cls-3" transform="translate(5.21 12.38)"><tspan x="0" y="0">1</tspan></text><rect class="cls-2" x="4.1" y="13.82" width="10.12" height="10.12"/><text class="cls-3" transform="translate(70.22 92.94) rotate(-180)"><tspan x="0" y="0">1</tspan></text><rect class="cls-2" x="61.2" y="81.38" width="10.12" height="10.12" transform="translate(132.52 172.88) rotate(180)"/></g></svg>`;
/**
 * SVG template for Triangle suit (number 1).
 * Exact contents from 1-Triangle-text.svg
 */
const SVG_TRIANGLE_1 = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.46 105.22"><defs><style>.cls-1{fill:#fff;stroke:#231f20;stroke-width:.46px;}.cls-2,.cls-3{fill:#640d0d;}.cls-3{font-family:ClarendonBT-Black, 'Clarendon Blk BT';font-size:12px;font-weight:800;}</style></defs><g id="Layer_1-2"><path class="cls-1" d="M6.18.23h63.1c3.29,0,5.95,2.67,5.95,5.95v92.86c0,3.29-2.67,5.95-5.95,5.95H6.18c-3.29,0-5.95-2.67-5.95-5.95V6.18C.23,2.89,2.89.23,6.18.23Z"/><polygon class="cls-2" points="37.73 31.86 13.77 73.36 61.69 73.36 37.73 31.86"/><text class="cls-3" transform="translate(5.21 12.38)"><tspan x="0" y="0">1</tspan></text><polygon class="cls-2" points="9.16 13.59 3.18 23.94 15.14 23.94 9.16 13.59"/><text class="cls-3" transform="translate(70.22 92.84) rotate(-180)"><tspan x="0" y="0">1</tspan></text><polygon class="cls-2" points="66.26 91.64 72.24 81.28 60.28 81.28 66.26 91.64"/></g></svg>`;
/**
 * SVG template for Star suit (number 1).
 * Exact contents from 1-Start-text.svg (handling both "Star" and "Start" variations)
 */
const SVG_STAR_1 = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.46 105.22"><defs><style>.cls-1{fill:#fff;stroke:#231f20;stroke-width:.46px;}.cls-2,.cls-3{fill:#640d0d;}.cls-3{font-family:ClarendonBT-Black, 'Clarendon Blk BT';font-size:12px;font-weight:800;}</style></defs><g id="Layer_1-2"><path class="cls-1" d="M6.18.23h63.1c3.29,0,5.95,2.67,5.95,5.95v92.86c0,3.29-2.67,5.95-5.95,5.95H6.18c-3.29,0-5.95-2.67-5.95-5.95V6.18C.23,2.89,2.89.23,6.18.23Z"/><polygon class="cls-2" points="46.77 56.01 51.93 71.87 38.43 62.07 24.94 71.87 30.09 56.01 16.6 46.21 33.28 46.21 38.43 30.35 43.59 46.21 60.27 46.21 46.77 56.01"/><text class="cls-3" transform="translate(5.21 12.38)"><tspan x="0" y="0">1</tspan></text><polygon class="cls-2" points="11.33 20.07 12.57 23.9 9.31 21.53 6.06 23.9 7.3 20.07 4.04 17.7 8.07 17.7 9.31 13.87 10.56 17.7 14.58 17.7 11.33 20.07"/><text class="cls-3" transform="translate(70.36 92.79) rotate(-180)"><tspan x="0" y="0">1</tspan></text><polygon class="cls-2" points="64.25 85.11 63 81.28 66.26 83.65 69.52 81.28 68.28 85.11 71.53 87.48 67.51 87.48 66.26 91.3 65.02 87.48 60.99 87.48 64.25 85.11"/></g></svg>`;
/**
 * SVG template for Whot card.
 * Exact contents from Whot-text.svg
 */
const SVG_WHOT = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.46 105.22"><defs><style>.cls-1{fill:none;}.cls-2{fill:#fff;stroke:#231f20;stroke-width:.46px;}.cls-3{stroke:#631011;stroke-width:.25px;}.cls-3,.cls-4,.cls-5{fill:#640d0d;}.cls-5{font-family:ClarendonBT-Black, 'Clarendon Blk BT';font-size:12px;font-weight:800;}</style></defs><g id="Layer_1-2"><path class="cls-2" d="M6.18.23h63.1c3.29,0,5.95,2.67,5.95,5.95v92.86c0,3.29-2.67,5.95-5.95,5.95H6.18c-3.29,0-5.95-2.67-5.95-5.95V6.18C.23,2.89,2.89.23,6.18.23Z"/><text class="cls-5" transform="translate(70.21 92.94) rotate(-180)"><tspan x="0" y="0">20</tspan></text><path class="cls-4" d="M66.6,80.44c-.07.47-.1,1.17-.1,2.1,0,1.86.08,3.22.25,4.08s.43,1.29.79,1.29c.23,0,.46-.12.68-.37s.36-.53.41-.86c.16.04.24.11.24.21,0,.4-.19.81-.58,1.25-.39.43-.76.65-1.11.65s-.63-.14-.82-.41-.35-.78-.48-1.52c-.21-1.1-.31-2.36-.31-3.8v-.41s-.85,1.64-.85,1.64l-.38.72-.54,1.07c-.31.61-.52,1.1-.62,1.46l-.9.86c.03-.3.04-.55.04-.76,0-.66-.13-1.72-.4-3.18l-.07-.38-.12-.61c-.08-.42-.16-.87-.23-1.36-.12.22-.19.35-.21.42l-.47.98-.57,1.17c-.48.99-.71,1.76-.71,2.31,0,.38.15.66.46.86l-.86.94c-.4-.26-.6-.58-.6-.94,0-.49.41-1.54,1.23-3.15.14-.27.3-.6.49-.98l.25-.52.26-.59.34-.76c.03-.07.09-.22.19-.47l.9-.96.02.26c.08.82.22,1.79.44,2.91l.07.35.1.52c.07.38.12.66.15.83l.11.8c0,.06.03.2.06.41l.79-1.57.32-.64c.59-1.16,1.04-2.12,1.35-2.89l1-.97Z"/><text class="cls-5" transform="translate(4.03 12.75)"><tspan x="0" y="0">20</tspan></text><path class="cls-4" d="M7.64,25.25c.07-.47.1-1.17.1-2.1,0-1.86-.08-3.22-.25-4.08s-.43-1.29-.79-1.29c-.23,0-.46.12-.68.37s-.36.53-.41.86c-.16-.04-.24-.11-.24-.21,0-.4.19-.81.58-1.25.38-.43.76-.65,1.11-.65s.63.14.82.41c.19.28.35.78.48,1.52.21,1.1.31,2.36.31,3.8v.41s.85-1.64.85-1.64l.37-.72.54-1.07c.31-.61.52-1.1.63-1.46l.9-.86c-.03.3-.04.55-.04.76,0,.66.13,1.72.4,3.18l.07.38.12.61c.08.42.16.87.23,1.36.12-.22.19-.35.21-.42l.47-.98.57-1.17c.48-.99.71-1.76.71-2.31,0-.38-.15-.66-.46-.86l.86-.94c.4.26.6.58.6.94,0,.49-.41,1.54-1.23,3.15-.14.27-.3.6-.49.98l-.25.52-.26.59-.34.76c-.03.07-.09.22-.19.47l-.9.96-.02-.26c-.08-.82-.22-1.79-.44-2.91l-.07-.35-.1-.52c-.07-.38-.12-.66-.15-.83l-.11-.8c0-.06-.03-.2-.06-.41l-.79,1.57-.32.64c-.59,1.16-1.04,2.12-1.35,2.89l-1,.97Z"/><path class="cls-3" d="M20.97,51.36c.07-.51.11-1.27.11-2.28,0-2.01-.09-3.49-.27-4.42-.18-.93-.47-1.4-.86-1.4-.25,0-.5.13-.74.4-.24.27-.39.58-.44.93-.17-.04-.26-.11-.26-.23,0-.43.21-.88.63-1.35.42-.47.82-.7,1.21-.7s.69.15.89.45c.2.3.38.85.52,1.65.22,1.19.34,2.56.34,4.11v.44s.92-1.78.92-1.78l.41-.78.59-1.16c.34-.66.56-1.19.68-1.59l.97-.93c-.03.32-.04.6-.04.83,0,.72.14,1.87.43,3.45l.08.41.13.66c.08.45.17.94.25,1.47.12-.23.2-.38.23-.45l.51-1.07.62-1.26c.52-1.07.77-1.91.77-2.51,0-.41-.17-.72-.5-.93l.93-1.02c.43.28.65.62.65,1.02,0,.53-.45,1.67-1.34,3.42-.15.29-.33.65-.53,1.07l-.27.56-.28.64-.37.83c-.03.07-.1.24-.2.51l-.97,1.03-.03-.28c-.08-.89-.24-1.94-.47-3.15l-.08-.38-.11-.56c-.08-.41-.13-.71-.16-.9l-.12-.87c0-.06-.03-.21-.06-.44l-.86,1.7-.35.69c-.64,1.25-1.13,2.3-1.46,3.13l-1.09,1.05Z"/><path class="cls-3" d="M31.81,47.61c.5-.74,1.04-1.36,1.63-1.84.59-.48,1.1-.73,1.53-.73s.62.29.62.86c0,.17-.02.43-.07.78l-.34,2.36c-.07.47-.11.85-.11,1.12,0,.22.06.33.18.33.29,0,.65-.39,1.08-1.16.11.06.16.13.16.2,0,.27-.24.64-.71,1.08-.47.45-.86.67-1.15.67-.33,0-.5-.24-.5-.71,0-.35.04-.83.13-1.44l.22-1.54c.07-.5.11-.9.11-1.2,0-.33-.12-.49-.35-.49-.54,0-1.09.37-1.64,1.1-.55.73-.88,1.52-.98,2.36l-.17,1.52-.95.39.02-.18.05-.47.05-.44.62-5.56c.15-1.31.63-2.43,1.46-3.36.83-.93,1.75-1.39,2.77-1.39.21,0,.42.02.62.07l-.93.91c-.24-.07-.47-.11-.68-.11-1.26,0-1.99.98-2.21,2.95l-.44,3.92Z"/><path class="cls-3" d="M38.48,51.27c-.95,0-1.43-.63-1.43-1.89,0-1.02.37-1.99,1.12-2.94.74-.94,1.52-1.41,2.32-1.41.96,0,1.45.63,1.45,1.89,0,1.02-.37,2-1.12,2.94s-1.52,1.41-2.34,1.41ZM39.25,50.56c.49,0,.89-.27,1.22-.81s.49-1.22.49-2.02c0-1.32-.41-1.98-1.23-1.98-.48,0-.89.27-1.21.82-.33.54-.49,1.22-.49,2.02,0,1.32.41,1.98,1.23,1.98Z"/><path class="cls-3" d="M44.63,45.94l-.31,2.81c-.06.5-.08.88-.08,1.12,0,.48.16.72.49.72.35,0,.71-.29,1.09-.86.06.08.09.15.09.22,0,.24-.21.52-.62.85s-.78.5-1.08.5c-.6,0-.9-.39-.9-1.16,0-.28.04-.74.11-1.38l.3-2.81h-1.33l.74-.74h.68l.13-1.16.93-.31-.15,1.47h2.69l-.74.74h-2.04Z"/><path class="cls-3" d="M54.39,54.79c-.07.51-.11,1.27-.11,2.28,0,2.01.09,3.49.27,4.42.18.93.47,1.4.86,1.4.25,0,.5-.13.74-.4s.38-.58.44-.93c.17.04.26.11.26.23,0,.43-.21.88-.63,1.35-.42.47-.82.7-1.21.7s-.69-.15-.89-.45c-.2-.3-.38-.85-.53-1.65-.22-1.19-.34-2.56-.34-4.11v-.44s-.92,1.78-.92,1.78l-.41.78-.59,1.16c-.34.66-.56,1.19-.68,1.59l-.97.93c.03-.32.04-.6.04-.83,0-.72-.14-1.87-.43-3.45l-.08-.41-.13-.66c-.08-.45-.17-.94-.25-1.47-.12.23-.2.38-.23.45l-.51,1.07-.62,1.26c-.52,1.07-.77,1.91-.77,2.51,0,.41.17.72.5.93l-.93,1.02c-.43-.28-.65-.62-.65-1.02,0-.53.45-1.67,1.34-3.42.15-.29.33-.65.54-1.07l.27-.56.28-.64.37-.83c.03-.07.1-.24.2-.51l.97-1.03.03.28c.08.89.24,1.94.47,3.15l.08.38.11.56c.08.41.13.71.16.9l.12.87c0,.06.03.21.06.44l.86-1.7.35-.69c.64-1.25,1.13-2.3,1.46-3.13l1.09-1.05Z"/><path class="cls-3" d="M43.55,58.55c-.5.74-1.04,1.36-1.63,1.84-.59.48-1.1.73-1.53.73s-.62-.29-.62-.86c0-.17.03-.43.07-.78l.34-2.36c.07-.47.11-.85.11-1.12,0-.22-.06-.33-.18-.33-.29,0-.65.39-1.08,1.16-.11-.06-.16-.13-.16-.2,0-.27.24-.64.71-1.08.47-.45.86-.67,1.15-.67.33,0,.5.24.5.71,0,.35-.04.83-.13,1.44l-.22,1.54c-.07.5-.11.9-.11,1.2,0,.33.12.49.35.49.54,0,1.09-.37,1.64-1.1.55-.73.88-1.52.98-2.36l.17-1.52.95-.39-.02.18-.05.47-.05.44-.62,5.56c-.15,1.31-.63,2.43-1.46,3.36-.83.93-1.75,1.39-2.77,1.39-.21,0-.42-.02-.62-.07l.93-.91c.24.07.47.11.69.11,1.26,0,1.99-.98,2.21-2.95l.44-3.92Z"/><path class="cls-3" d="M36.88,54.88c.95,0,1.43.63,1.43,1.89,0,1.02-.37,1.99-1.12,2.94-.75.94-1.52,1.41-2.32,1.41-.96,0-1.45-.63-1.45-1.89,0-1.02.37-2,1.12-2.94s1.52-1.41,2.34-1.41ZM36.11,55.59c-.49,0-.89.27-1.22.81s-.49,1.22-.49,2.02c0,1.32.41,1.98,1.23,1.98.48,0,.89-.27,1.21-.82.33-.54.49-1.22.49-2.02,0-1.32-.41-1.98-1.23-1.98Z"/><path class="cls-3" d="M30.73,60.22l.31-2.81c.06-.5.08-.88.08-1.12,0-.48-.16-.72-.49-.72-.35,0-.71.29-1.09.86-.06-.08-.09-.15-.09-.22,0-.24.21-.52.62-.85s.78-.5,1.08-.5c.6,0,.9.39.9,1.16,0,.28-.04.74-.11,1.38l-.3,2.81h1.33l-.74.74h-.68l-.13,1.16-.93.31.15-1.47h-2.69l.74-.74h2.04Z"/><rect class="cls-1" x="27.89" y="12.75" width="5.09" height="4.08"/></g></svg>`;
/**
 * Template mapping for easy access.
 */
const SVG_TEMPLATES = {
    circle: SVG_CIRCLE_1,
    cross: SVG_CROSS_1,
    square: SVG_SQUARE_1,
    triangle: SVG_TRIANGLE_1,
    star: SVG_STAR_1,
    whot: SVG_WHOT,
};

/**
 * Helper functions for SVG manipulation and creation.
 */
/**
 * Create an SVG element with proper attributes.
 */
/**
 * Escape XML special characters.
 */
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
/**
 * Create SVG attributes string.
 */
function createAttributes(attributes) {
    return Object.entries(attributes)
        .map(([key, value]) => `${key}="${escapeXml(value)}"`)
        .join(' ');
}
/**
 * Replace text content in SVG tspan elements.
 */
function replaceTspanText(svg, newText, occurrences = 2) {
    let result = svg;
    let count = 0;
    // Replace tspan content with new text
    result = result.replace(/<tspan[^>]*>([^<]*)<\/tspan>/g, (match, content) => {
        if (count < occurrences) {
            count++;
            return match.replace(content, newText);
        }
        return match;
    });
    return result;
}
/**
 * Create accessible SVG with title and description.
 */
function createAccessibleSVG(content, title, description, attributes = {}) {
    const baseAttrs = {
        role: 'img',
        'aria-labelledby': 'title desc',
        ...attributes,
    };
    const attrs = createAttributes(baseAttrs);
    return `<svg ${attrs}>
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(description)}</desc>
  ${content}
</svg>`;
}
/**
 * Clean SVG template by removing XML declaration only.
 */
function cleanSVGTemplate(template) {
    // Remove XML declaration if present
    let cleaned = template.replace(/^<\?xml[^>]*\?>\s*/, '');
    // Add xmlns to g elements that don't have it
    cleaned = cleaned.replace(/<g\s+([^>]*?)>/g, (match, attributes) => {
        if (!attributes.includes('xmlns=')) {
            return `<g xmlns="http://www.w3.org/2000/svg" ${attributes}>`;
        }
        return match;
    });
    return cleaned;
}

/**
 * Generate Circle suit symbol SVG.
 */
function renderCircleSymbol(size = 20, color = '#640d0d') {
    const center = size / 2;
    const radius = size * 0.4;
    return `<circle cx="${center}" cy="${center}" r="${radius}" fill="${color}"/>`;
}
/**
 * Generate Triangle suit symbol SVG.
 */
function renderTriangleSymbol(size = 20, color = '#640d0d') {
    const center = size / 2;
    const height = size * 0.8;
    const width = size * 0.7;
    const top = center - height / 2;
    const left = center - width / 2;
    const right = center + width / 2;
    const bottom = center + height / 2;
    const points = `${center},${top} ${left},${bottom} ${right},${bottom}`;
    return `<polygon points="${points}" fill="${color}"/>`;
}
/**
 * Generate Square suit symbol SVG.
 */
function renderSquareSymbol(size = 20, color = '#640d0d') {
    const center = size / 2;
    const side = size * 0.6;
    const x = center - side / 2;
    const y = center - side / 2;
    return `<rect x="${x}" y="${y}" width="${side}" height="${side}" fill="${color}"/>`;
}
/**
 * Generate Star suit symbol SVG.
 */
function renderStarSymbol(size = 20, color = '#640d0d') {
    const center = size / 2;
    const outerRadius = size * 0.4;
    const innerRadius = size * 0.15;
    const points = 5;
    const starPoints = [];
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        const x = center + radius * Math.cos(angle - Math.PI / 2);
        const y = center + radius * Math.sin(angle - Math.PI / 2);
        starPoints.push(`${x},${y}`);
    }
    return `<polygon points="${starPoints.join(' ')}" fill="${color}"/>`;
}
/**
 * Generate Cross suit symbol SVG.
 */
function renderCrossSymbol(size = 20, color = '#640d0d') {
    const center = size / 2;
    const thickness = size * 0.2;
    const length = size * 0.6;
    const verticalX = center - thickness / 2;
    const verticalY = center - length / 2;
    const horizontalX = center - length / 2;
    const horizontalY = center - thickness / 2;
    return (`<rect x="${verticalX}" y="${verticalY}" width="${thickness}" height="${length}" fill="${color}"/>` +
        `<rect x="${horizontalX}" y="${horizontalY}" width="${length}" height="${thickness}" fill="${color}"/>`);
}
/**
 * Generate Whot symbol SVG (simplified text representation).
 */
function renderWhotSymbol(size = 20, color = '#640d0d') {
    const center = size / 2;
    const fontSize = size * 0.3;
    return `<text x="${center}" y="${center + fontSize / 3}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${color}">W</text>`;
}
/**
 * Generate corner symbol for a suit.
 */
function renderCornerSymbol(suit, size = 10, color) {
    switch (suit) {
        case 'circle':
            return renderCircleSymbol(size, color);
        case 'triangle':
            return renderTriangleSymbol(size, color);
        case 'square':
            return renderSquareSymbol(size, color);
        case 'star':
            return renderStarSymbol(size, color);
        case 'cross':
            return renderCrossSymbol(size, color);
        case 'whot':
            return renderWhotSymbol(size, color);
        default:
            return '';
    }
}

/**
 * Get the appropriate template for a card.
 */
function getTemplateForCard(card) {
    return SVG_TEMPLATES[card.suit];
}
/**
 * Render a card using the template backend.
 */
function renderCardTemplate(card, _theme, options) {
    const template = getTemplateForCard(card);
    if (!template) {
        throw new Error(`No template found for card: ${card.suit} ${card.label}`);
    }
    const cleanedTemplate = cleanSVGTemplate(template);
    let svg = replaceTspanText(cleanedTemplate, card.label);
    // Templates are now normalized, so no CSS processing needed
    // The templates already have consistent CSS class structure
    const title = `${card.suit} ${card.label}`;
    const description = `Whot playing card with suit ${card.suit} and label ${card.label}`;
    let customAttrsString = ' role="img" aria-labelledby="title desc"';
    if (options.className) {
        customAttrsString += ` class="${options.className}"`;
    }
    if (options.dataAttrs) {
        Object.entries(options.dataAttrs).forEach(([key, value]) => {
            customAttrsString += ` data-${key}="${value}"`;
        });
    }
    if (options.width) {
        customAttrsString += ` width="${options.width}"`;
    }
    if (options.height) {
        customAttrsString += ` height="${options.height}"`;
    }
    // Add unique CSS class prefix to prevent conflicts in grid rendering
    const cssPrefix = options.cssPrefix || '';
    let processedSvg = svg;
    if (cssPrefix) {
        // Replace CSS class references with prefixed versions
        processedSvg = processedSvg.replace(/class="cls-(\d+)"/g, `class="${cssPrefix}-cls-$1"`);
        // Update CSS definitions with prefixed class names
        processedSvg = processedSvg.replace(/\.cls-(\d+)/g, `.${cssPrefix}-cls-$1`);
    }
    const svgWithAccessibility = processedSvg.replace(/<svg([^>]*)>/, `<svg$1${customAttrsString}>`);
    const titleElement = `<title id="title">${title}</title>`;
    const descElement = `<desc id="desc">${description}</desc>`;
    const finalSvg = svgWithAccessibility.replace(/<svg[^>]*>/, (match) => `${match}${titleElement}${descElement}`);
    return finalSvg;
}
/**
 * Render a card using the programmatic backend.
 */
function renderCardProgrammatic(card, theme, options) {
    const width = options.width ?? theme.width;
    const height = options.height ?? theme.height;
    // Card background
    const cardPath = `M${theme.borderRadius} 0h${width - 2 * theme.borderRadius}c${theme.borderRadius} 0 ${theme.borderRadius} ${theme.borderRadius} ${theme.borderRadius} ${theme.borderRadius}v${height - 2 * theme.borderRadius}c0 ${theme.borderRadius} -${theme.borderRadius} ${theme.borderRadius} -${theme.borderRadius} ${theme.borderRadius}H${theme.borderRadius}c-${theme.borderRadius} 0 -${theme.borderRadius} -${theme.borderRadius} -${theme.borderRadius} -${theme.borderRadius}V${theme.borderRadius}C0 ${theme.borderRadius} ${theme.borderRadius} 0 ${theme.borderRadius} 0z`;
    // Center suit symbol
    const centerSymbol = renderCornerSymbol(card.suit, theme.cornerSymbolSize * 2, theme.suitColors[card.suit]);
    const centerX = width / 2;
    const centerY = height / 2;
    // Corner elements
    const cornerSymbol = renderCornerSymbol(card.suit, theme.cornerSymbolSize, theme.suitColors[card.suit]);
    const cornerX = theme.cornerInsetX;
    const cornerY = theme.cornerInsetY;
    const cornerTextX = cornerX + theme.cornerSymbolSize + 2;
    const cornerTextY = cornerY + theme.cornerFontSize;
    // Bottom-right corner (rotated)
    const bottomRightX = width - theme.cornerInsetX;
    const bottomRightY = height - theme.cornerInsetY;
    const svgContent = `
    <path d="${cardPath}" fill="${theme.fillColor}" stroke="${theme.strokeColor}" stroke-width="${theme.borderWidth}"/>
    <g transform="translate(${centerX - theme.cornerSymbolSize} ${centerY - theme.cornerSymbolSize})">
      ${centerSymbol}
    </g>
    <g transform="translate(${cornerX} ${cornerY})">
      ${cornerSymbol}
    </g>
    <text x="${cornerTextX}" y="${cornerTextY}" 
          font-family="${theme.cornerFontFamily}" 
          font-size="${theme.cornerFontSize}" 
          font-weight="bold" 
          fill="${theme.suitColors[card.suit]}">${card.label}</text>
    <g transform="translate(${bottomRightX} ${bottomRightY}) rotate(180)">
      ${cornerSymbol}
    </g>
    <text x="${bottomRightX - theme.cornerSymbolSize - 2}" y="${bottomRightY - theme.cornerSymbolSize + theme.cornerFontSize}" 
          transform="translate(${bottomRightX} ${bottomRightY}) rotate(180)"
          font-family="${theme.cornerFontFamily}" 
          font-size="${theme.cornerFontSize}" 
          font-weight="bold" 
          fill="${theme.suitColors[card.suit]}">${card.label}</text>
  `;
    const title = `${card.suit} ${card.label}`;
    const description = `Whot playing card with suit ${card.suit} and label ${card.label}`;
    const attrs = {
        viewBox: `0 0 ${width} ${height}`,
        width: width.toString(),
        height: height.toString(),
    };
    if (options.className) {
        attrs.class = options.className;
    }
    if (options.dataAttrs) {
        Object.entries(options.dataAttrs).forEach(([key, value]) => {
            attrs[`data-${key}`] = value;
        });
    }
    return createAccessibleSVG(svgContent, title, description, attrs);
}
/**
 * Render a single card.
 */
function renderCard(card, options = {}) {
    const theme = mergeTheme(options.theme);
    const renderer = options.renderer ?? 'template';
    let svgString;
    if (renderer === 'template') {
        svgString = renderCardTemplate(card, theme, options);
    }
    else {
        svgString = renderCardProgrammatic(card, theme, options);
    }
    if (options.asDom && typeof window !== 'undefined') {
        // Browser environment - return SVGElement
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        if (!svgElement) {
            throw new Error('Failed to parse SVG string');
        }
        return svgElement;
    }
    return svgString;
}
/**
 * Render a grid of cards.
 */
function renderGrid(cards, cols, options = {}) {
    const theme = mergeTheme(options.theme);
    const gap = options.gap ?? 10;
    const cardWidth = options.width ?? theme.width;
    const cardHeight = options.height ?? theme.height;
    const rows = Math.ceil(cards.length / cols);
    const gridWidth = cols * cardWidth + (cols - 1) * gap;
    const gridHeight = rows * cardHeight + (rows - 1) * gap;
    const cardElements = cards.map((card, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * (cardWidth + gap);
        const y = row * (cardHeight + gap);
        const cardSvg = renderCard(card, {
            ...options,
            asDom: false,
            cssPrefix: `card-${index}`, // Add unique CSS prefix for each card
        });
        // Extract the content from the SVG (remove the outer svg tag)
        const contentMatch = cardSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        const content = contentMatch ? contentMatch[1] : '';
        return `<g transform="translate(${x} ${y})">${content}</g>`;
    });
    const svgContent = cardElements.join('\n');
    const title = `Grid of ${cards.length} Whot cards`;
    const description = `Grid layout of ${cards.length} Whot playing cards arranged in ${cols} columns`;
    const attrs = {
        viewBox: `0 0 ${gridWidth} ${gridHeight}`,
        width: gridWidth.toString(),
        height: gridHeight.toString(),
    };
    if (options.className) {
        attrs.class = options.className;
    }
    if (options.dataAttrs) {
        Object.entries(options.dataAttrs).forEach(([key, value]) => {
            attrs[`data-${key}`] = value;
        });
    }
    const svgString = createAccessibleSVG(svgContent, title, description, attrs);
    if (options.asDom && typeof window !== 'undefined') {
        // Browser environment - return SVGElement
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');
        if (!svgElement) {
            throw new Error('Failed to parse SVG string');
        }
        return svgElement;
    }
    return svgString;
}

/**
 * Current version of the Whot library.
 */
const VERSION = '1.0.0';

export { DEFAULT_THEME, Deck, SeededRNG, VERSION, createRNG, mergeTheme, renderCard, renderGrid };
//# sourceMappingURL=index.esm.js.map
