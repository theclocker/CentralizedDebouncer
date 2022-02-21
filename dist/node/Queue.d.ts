export default class Queue<T> extends Array {
    private constructor();
    static create<T>(): Queue<T>;
    enqueue(value: T): void;
    bulkEnqueue(values: Array<T>): void;
    dequeue(): T;
    peek(): T;
    isEmpty(): boolean;
}
