/**
 * Simple seeded random number generator using xorshift algorithm.
 */
export class SeededRNG {
  private state: number;

  constructor(seed: number | string) {
    this.state = this.hashSeed(seed);
  }

  /**
   * Hash a seed string or number to a 32-bit integer.
   */
  private hashSeed(seed: number | string): number {
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
  next(): number {
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    return (this.state >>> 0) / 0x100000000;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive).
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm.
   */
  shuffle<T>(array: T[]): T[] {
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
export function createRNG(seed?: number | string): SeededRNG | null {
  if (seed === undefined) {
    return null;
  }
  return new SeededRNG(seed);
}
