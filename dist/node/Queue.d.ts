export default class Queue<T> extends Array {
    /**
     * Use Queue.create to create a new queue that is extending an Array
     * @param items Initial array items
     */
    private constructor();
    static create<T>(): Queue<T>;
    enqueue(value: T): void;
    bulkEnqueue(values: Array<T>): void;
    dequeue(): T;
    peek(): T;
    isEmpty(): boolean;
}
