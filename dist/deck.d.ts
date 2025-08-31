import type { Card, DeckOptions, DealOptions } from './types';
/**
 * Represents a deck of Whot cards.
 */
export declare class Deck {
    readonly cards: Card[];
    private readonly options;
    private readonly rng;
    /**
     * Create a new deck of Whot cards.
     */
    constructor(options?: DeckOptions);
    /**
     * Reset the deck to its initial state.
     */
    reset(): void;
    /**
     * Shuffle the deck using Fisher-Yates algorithm.
     */
    shuffle(): void;
    /**
     * Draw cards from the top of the deck.
     */
    draw(n?: number): Card[];
    /**
     * Deal cards to multiple players.
     */
    deal(opts: DealOptions): Card[][];
    /**
     * Get the current size of the deck.
     */
    size(): number;
    /**
     * Check if the deck is empty.
     */
    isEmpty(): boolean;
    /**
     * Get the total number of cards in a full deck.
     */
    getFullDeckSize(): number;
    /**
     * Convert deck to JSON string.
     */
    toJSON(): string;
    /**
     * Create a deck from JSON string.
     */
    static fromJSON(json: string): Deck;
    /**
     * Get deck options.
     */
    getOptions(): Required<DeckOptions>;
    /**
     * Get a copy of the current cards without modifying the deck.
     */
    getCards(): Card[];
    /**
     * Add cards to the deck.
     */
    addCards(cards: Card[]): void;
    /**
     * Remove specific cards from the deck.
     */
    removeCards(cardIds: string[]): Card[];
    /**
     * Find a card by its ID.
     */
    findCard(cardId: string): Card | undefined;
    /**
     * Check if the deck contains a specific card.
     */
    hasCard(cardId: string): boolean;
}
//# sourceMappingURL=deck.d.ts.map