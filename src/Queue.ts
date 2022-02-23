export default class Queue<T> extends Array {

  /**
   * Use Queue.create to create a new queue that is extending an Array
   * @param items Initial array items
   */
  private constructor(...items: Array<any>) {
    super(...items);
  }

  static create<T>(): Queue<T> {
    return Object.create(Queue.prototype);
  }
  
  public enqueue(value: T): void {
    this.push(value);
  }

  public bulkEnqueue(values: Array<T>): void {
    this.push(...values);
  }

  public dequeue(): T {
    return this.shift();
  }

  public peek(): T {
    return this[0];
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }
}