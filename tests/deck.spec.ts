import { describe, it, expect, beforeEach } from 'vitest';
import { Deck } from '../src/deck';
import type { Card } from '../src/types';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('constructor', () => {
    it('should create a deck with default options', () => {
      expect(deck.size()).toBe(54);
      expect(deck.getOptions().numDecks).toBe(1);
      expect(deck.getOptions().whotLabel).toBe('WHOT');
    });

    it('should create multiple decks when specified', () => {
      const multiDeck = new Deck({ numDecks: 3 });
      expect(multiDeck.size()).toBe(54 * 3);
      expect(multiDeck.getOptions().numDecks).toBe(3);
    });

    it('should use custom Whot label', () => {
      const customDeck = new Deck({ whotLabel: '20' });
      const whotCards = customDeck.getCards().filter(card => card.suit === 'whot');
      expect(whotCards).toHaveLength(5);
      expect(whotCards.every(card => card.label === '20')).toBe(true);
    });
  });

  describe('deck composition', () => {
    it('should have exactly 54 cards in a single deck', () => {
      expect(deck.size()).toBe(54);
    });

    it('should have correct number of cards per suit', () => {
      const cards = deck.getCards();

      expect(cards.filter(c => c.suit === 'circle')).toHaveLength(12);
      expect(cards.filter(c => c.suit === 'triangle')).toHaveLength(12);
      expect(cards.filter(c => c.suit === 'cross')).toHaveLength(9);
      expect(cards.filter(c => c.suit === 'square')).toHaveLength(9);
      expect(cards.filter(c => c.suit === 'star')).toHaveLength(7);
      expect(cards.filter(c => c.suit === 'whot')).toHaveLength(5);
    });

    it('should have correct card numbers for each suit', () => {
      const cards = deck.getCards();

      const circleNumbers = cards
        .filter(c => c.suit === 'circle')
        .map(c => parseInt(c.label))
        .sort((a, b) => a - b);
      expect(circleNumbers).toEqual([1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14]);

      const starNumbers = cards
        .filter(c => c.suit === 'star')
        .map(c => parseInt(c.label))
        .sort((a, b) => a - b);
      expect(starNumbers).toEqual([1, 2, 3, 4, 5, 7, 8]);
    });

    it('should have unique IDs for all cards', () => {
      const cards = deck.getCards();
      const ids = cards.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(cards.length);
    });

    it('should have correct Whot card IDs', () => {
      const whotCards = deck.getCards().filter(c => c.suit === 'whot');
      const expectedIds = [
        'whot:WHOT#1',
        'whot:WHOT#2',
        'whot:WHOT#3',
        'whot:WHOT#4',
        'whot:WHOT#5',
      ];
      expect(whotCards.map(c => c.id)).toEqual(expectedIds);
    });
  });

  describe('shuffle', () => {
    it('should maintain deck size after shuffle', () => {
      const originalSize = deck.size();
      deck.shuffle();
      expect(deck.size()).toBe(originalSize);
    });

    it('should produce different order with different seeds', () => {
      const deck1 = new Deck({ randomSeed: 123 });
      const deck2 = new Deck({ randomSeed: 456 });

      deck1.shuffle();
      deck2.shuffle();

      const cards1 = deck1.getCards().map(c => c.id);
      const cards2 = deck2.getCards().map(c => c.id);

      expect(cards1).not.toEqual(cards2);
    });

    it('should produce same order with same seed', () => {
      const deck1 = new Deck({ randomSeed: 123 });
      const deck2 = new Deck({ randomSeed: 123 });

      deck1.shuffle();
      deck2.shuffle();

      const cards1 = deck1.getCards().map(c => c.id);
      const cards2 = deck2.getCards().map(c => c.id);

      expect(cards1).toEqual(cards2);
    });
  });

  describe('draw', () => {
    it('should draw single card by default', () => {
      const drawn = deck.draw();
      expect(drawn).toHaveLength(1);
      expect(deck.size()).toBe(53);
    });

    it('should draw multiple cards', () => {
      const drawn = deck.draw(5);
      expect(drawn).toHaveLength(5);
      expect(deck.size()).toBe(49);
    });

    it('should throw error when drawing more cards than available', () => {
      expect(() => deck.draw(55)).toThrow();
    });

    it('should throw error when drawing negative number of cards', () => {
      expect(() => deck.draw(-1)).toThrow();
    });

    it('should draw cards from top of deck', () => {
      const originalCards = deck.getCards();
      const drawn = deck.draw(3);
      expect(drawn).toEqual(originalCards.slice(0, 3));
    });
  });

  describe('deal', () => {
    it('should deal cards to multiple players', () => {
      const hands = deck.deal({ players: 4, cardsPerPlayer: 5 });
      expect(hands).toHaveLength(4);
      expect(hands.every(hand => hand.length === 5)).toBe(true);
      expect(deck.size()).toBe(34);
    });

    it('should deal cards round-robin', () => {
      const hands = deck.deal({ players: 2, cardsPerPlayer: 3 });
      const allCards = [...hands[0], ...hands[1]];
      expect(allCards).toHaveLength(6);
      expect(hands[0]).toHaveLength(3);
      expect(hands[1]).toHaveLength(3);
    });

    it('should throw error when insufficient cards', () => {
      expect(() => deck.deal({ players: 10, cardsPerPlayer: 10 })).toThrow();
    });
  });

  describe('reset', () => {
    it('should restore deck to full size', () => {
      deck.draw(10);
      expect(deck.size()).toBe(44);

      deck.reset();
      expect(deck.size()).toBe(54);
    });

    it('should restore deck to original order', () => {
      const originalCards = deck.getCards();
      deck.shuffle();
      deck.reset();
      const resetCards = deck.getCards();
      expect(resetCards).toEqual(originalCards);
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize deck correctly', () => {
      deck.shuffle();
      const json = deck.toJSON();
      const restored = Deck.fromJSON(json);

      expect(restored.size()).toBe(deck.size());
      expect(restored.getCards().map(c => c.id)).toEqual(deck.getCards().map(c => c.id));
    });

    it('should preserve deck options in serialization', () => {
      const customDeck = new Deck({ numDecks: 2, whotLabel: '20', randomSeed: 123 });
      const json = customDeck.toJSON();
      const restored = Deck.fromJSON(json);

      expect(restored.getOptions().numDecks).toBe(2);
      expect(restored.getOptions().whotLabel).toBe('20');
      expect(restored.getOptions().randomSeed).toBe(123);
    });
  });

  describe('utility methods', () => {
    it('should check if deck is empty', () => {
      expect(deck.isEmpty()).toBe(false);
      deck.draw(54);
      expect(deck.isEmpty()).toBe(true);
    });

    it('should get full deck size', () => {
      expect(deck.getFullDeckSize()).toBe(54);
      const multiDeck = new Deck({ numDecks: 3 });
      expect(multiDeck.getFullDeckSize()).toBe(54 * 3);
    });

    it('should find card by ID', () => {
      const card = deck.findCard('circle:7');
      expect(card).toBeDefined();
      expect(card?.suit).toBe('circle');
      expect(card?.label).toBe('7');
    });

    it('should check if deck has specific card', () => {
      expect(deck.hasCard('circle:7')).toBe(true);
      expect(deck.hasCard('nonexistent:1')).toBe(false);
    });

    it('should add cards to deck', () => {
      const originalSize = deck.size();
      const newCard: Card = { id: 'test:1', suit: 'circle', label: '1' };
      deck.addCards([newCard]);
      expect(deck.size()).toBe(originalSize + 1);
      expect(deck.hasCard('test:1')).toBe(true);
    });

    it('should remove specific cards', () => {
      const removed = deck.removeCards(['circle:7', 'triangle:5']);
      expect(removed).toHaveLength(2);
      expect(deck.size()).toBe(52);
      expect(deck.hasCard('circle:7')).toBe(false);
      expect(deck.hasCard('triangle:5')).toBe(false);
    });
  });
});
