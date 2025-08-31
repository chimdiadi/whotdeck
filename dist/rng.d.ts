/**
 * Simple seeded random number generator using xorshift algorithm.
 */
export declare class SeededRNG {
    private state;
    constructor(seed: number | string);
    /**
     * Hash a seed string or number to a 32-bit integer.
     */
    private hashSeed;
    /**
     * Generate next random number using xorshift algorithm.
     */
    next(): number;
    /**
     * Generate random integer between min (inclusive) and max (exclusive).
     */
    nextInt(min: number, max: number): number;
    /**
     * Shuffle an array using Fisher-Yates algorithm.
     */
    shuffle<T>(array: T[]): T[];
}
/**
 * Create a random number generator with optional seed.
 */
export declare function createRNG(seed?: number | string): SeededRNG | null;
//# sourceMappingURL=rng.d.ts.map