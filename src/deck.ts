import type { Card, DeckOptions, DealOptions } from './types';
import { DECK_COMPOSITION, WHOT_CARDS_PER_DECK, DEFAULT_WHOT_LABEL } from './render/layout';
import { createRNG } from './rng';

/**
 * Represents a deck of Whot cards.
 */
export class Deck {
  public readonly cards: Card[];
  private readonly options: Required<DeckOptions>;
  private readonly rng: ReturnType<typeof createRNG>;

  /**
   * Create a new deck of Whot cards.
   */
  constructor(options: DeckOptions = {}) {
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
  reset(): void {
    this.cards.length = 0;

    // Create cards for each deck
    for (let deckIndex = 0; deckIndex < this.options.numDecks; deckIndex++) {
      // Add numbered cards for each suit
      for (const [suit, numbers] of Object.entries(DECK_COMPOSITION)) {
        if (suit === 'whot') continue; // Whot cards are handled separately

        for (const number of numbers) {
          this.cards.push({
            id: `${suit}:${number}${deckIndex > 0 ? `#${deckIndex + 1}` : ''}`,
            suit: suit as Card['suit'],
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
  shuffle(): void {
    if (this.rng) {
      // Use seeded RNG for deterministic shuffling
      this.cards.splice(0, this.cards.length, ...this.rng.shuffle(this.cards));
    } else {
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
  draw(n: number = 1): Card[] {
    if (n < 0 || n > this.cards.length) {
      throw new Error(`Cannot draw ${n} cards from deck of size ${this.cards.length}`);
    }

    return this.cards.splice(0, n);
  }

  /**
   * Deal cards to multiple players.
   */
  deal(opts: DealOptions): Card[][] {
    const { players, cardsPerPlayer } = opts;
    const totalCards = players * cardsPerPlayer;

    if (totalCards > this.cards.length) {
      throw new Error(
        `Cannot deal ${totalCards} cards to ${players} players from deck of size ${
          this.cards.length
        }`,
      );
    }

    const hands: Card[][] = Array.from({ length: players }, () => []);

    // Deal cards round-robin
    for (let i = 0; i < totalCards; i++) {
      const playerIndex = i % players;
      const card = this.cards.shift()!;
      hands[playerIndex].push(card);
    }

    return hands;
  }

  /**
   * Get the current size of the deck.
   */
  size(): number {
    return this.cards.length;
  }

  /**
   * Check if the deck is empty.
   */
  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  /**
   * Get the total number of cards in a full deck.
   */
  getFullDeckSize(): number {
    return (
      (Object.values(DECK_COMPOSITION)
        .filter(numbers => numbers.length > 0)
        .reduce((sum, numbers) => sum + numbers.length, 0) +
        WHOT_CARDS_PER_DECK) *
      this.options.numDecks
    );
  }

  /**
   * Convert deck to JSON string.
   */
  toJSON(): string {
    return JSON.stringify({
      cards: this.cards,
      options: this.options,
    });
  }

  /**
   * Create a deck from JSON string.
   */
  static fromJSON(json: string): Deck {
    const data = JSON.parse(json);
    const deck = new Deck(data.options);
    deck.cards.splice(0, deck.cards.length, ...data.cards);
    return deck;
  }

  /**
   * Get deck options.
   */
  getOptions(): Required<DeckOptions> {
    return { ...this.options };
  }

  /**
   * Get a copy of the current cards without modifying the deck.
   */
  getCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Add cards to the deck.
   */
  addCards(cards: Card[]): void {
    this.cards.push(...cards);
  }

  /**
   * Remove specific cards from the deck.
   */
  removeCards(cardIds: string[]): Card[] {
    const removed: Card[] = [];
    const remaining: Card[] = [];

    for (const card of this.cards) {
      if (cardIds.includes(card.id)) {
        removed.push(card);
      } else {
        remaining.push(card);
      }
    }

    this.cards.splice(0, this.cards.length, ...remaining);
    return removed;
  }

  /**
   * Find a card by its ID.
   */
  findCard(cardId: string): Card | undefined {
    return this.cards.find(card => card.id === cardId);
  }

  /**
   * Check if the deck contains a specific card.
   */
  hasCard(cardId: string): boolean {
    return this.cards.some(card => card.id === cardId);
  }
}
