/**
 * Wraps a function with a cache of previous results, returns values from cache when possible
 * Resolver can return null to skip caching
 * @param func The function to memoize
 * @param resolver A function to determine cache key from arguments. Defaults to just using the first argument
 * @returns memoized version of func
 */
declare function memoize<T extends unknown[], R>(func: (...args: T) => R, resolver?: (...args: T) => unknown): (...args: T) => R;
