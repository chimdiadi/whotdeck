import { describe, it, expect } from 'vitest';
import { SeededRNG, createRNG } from '../src/rng';

describe('SeededRNG', () => {
  describe('constructor', () => {
    it('should create RNG with numeric seed', () => {
      const rng = new SeededRNG(123);
      expect(rng).toBeInstanceOf(SeededRNG);
    });

    it('should create RNG with string seed', () => {
      const rng = new SeededRNG('test-seed');
      expect(rng).toBeInstanceOf(SeededRNG);
    });
  });

  describe('next', () => {
    it('should generate numbers between 0 and 1', () => {
      const rng = new SeededRNG(123);

      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should generate different numbers with different seeds', () => {
      const rng1 = new SeededRNG(123);
      const rng2 = new SeededRNG(456);

      const value1 = rng1.next();
      const value2 = rng2.next();

      expect(value1).not.toBe(value2);
    });

    it('should generate same sequence with same seed', () => {
      const rng1 = new SeededRNG(123);
      const rng2 = new SeededRNG(123);

      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });
  });

  describe('nextInt', () => {
    it('should generate integers within range', () => {
      const rng = new SeededRNG(123);

      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(0, 10);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('should handle negative ranges', () => {
      const rng = new SeededRNG(123);

      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(-10, 0);
        expect(value).toBeGreaterThanOrEqual(-10);
        expect(value).toBeLessThan(0);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('should handle single value range', () => {
      const rng = new SeededRNG(123);
      const value = rng.nextInt(5, 6);
      expect(value).toBe(5);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array without losing elements', () => {
      const rng = new SeededRNG(123);
      const original = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle([...original]);

      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
    });

    it('should produce different order with different seeds', () => {
      const rng1 = new SeededRNG(123);
      const rng2 = new SeededRNG(456);
      const original = [1, 2, 3, 4, 5];

      const shuffled1 = rng1.shuffle([...original]);
      const shuffled2 = rng2.shuffle([...original]);

      expect(shuffled1).not.toEqual(shuffled2);
    });

    it('should produce same order with same seed', () => {
      const rng1 = new SeededRNG(123);
      const rng2 = new SeededRNG(123);
      const original = [1, 2, 3, 4, 5];

      const shuffled1 = rng1.shuffle([...original]);
      const shuffled2 = rng2.shuffle([...original]);

      expect(shuffled1).toEqual(shuffled2);
    });

    it('should handle empty array', () => {
      const rng = new SeededRNG(123);
      const shuffled = rng.shuffle([]);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element array', () => {
      const rng = new SeededRNG(123);
      const shuffled = rng.shuffle([42]);
      expect(shuffled).toEqual([42]);
    });

    it('should not modify original array', () => {
      const rng = new SeededRNG(123);
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];

      rng.shuffle(original);
      expect(original).toEqual(originalCopy);
    });
  });
});

describe('createRNG', () => {
  it('should create RNG with seed', () => {
    const rng = createRNG(123);
    expect(rng).toBeInstanceOf(SeededRNG);
  });

  it('should create RNG with string seed', () => {
    const rng = createRNG('test-seed');
    expect(rng).toBeInstanceOf(SeededRNG);
  });

  it('should return null when no seed provided', () => {
    const rng = createRNG();
    expect(rng).toBeNull();
  });

  it('should return null when seed is undefined', () => {
    const rng = createRNG(undefined);
    expect(rng).toBeNull();
  });
});
