/// <reference path="knockout.d.ts"/>
type SubscribableOrFunction<T = any> = Subscribable<T> | (() => T);
type LazyLoadOptions = {
    triggerMargin: string;
    threshold: number;
    pageSize: number;
    reset?: SubscribableOrFunction<any>;
    pause?: SubscribableOrFunction<boolean>;
};
/**
 * Provides a lazy-loading PureComputed slice of an observable array, for use in bindings like foreach, and inserts a loader element
 * into the page to trigger loading more of the underlying array. Computed lists are cached when possible.
 *
 * @param key - Unique identifier for each list, used for caching
 * @param boundNode - HTML Node the list is bound to. Must be in a scrolling container, and the loader will be added to a non-table parent of this node.
 * @param list - The observable array to lazily load
 * @param options - Optional parameters
 * @param options.pageSize Number of elements per lazy list page, default 40
 * @param options.triggerMargin Trigger margin for IntersectionObserver, default 10%
 * @param options.threshold Threshold for IntersectionObserver, default 0
 * @param options.reset A function to trigger resets to the list. The function can be any Knockout subscribable or a function that evaluates a Knockout subscribable.
 * The list will reset to the first page whenever the output changes, or if reset is subscribable and reset.notifySubscribers() is called.
 *
 * @return A PureComputed array initially showing the first pageSize elements of the base list.
 */
declare function lazyLoad(key: string, boundNode: Node, list: Subscribable<Array<unknown>>, options?: Partial<LazyLoadOptions>): PureComputed<Array<unknown>>;
declare function lazyLoadCallback(key: string): void;

