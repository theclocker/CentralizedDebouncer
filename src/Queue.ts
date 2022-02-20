export default class Queue<T> extends Array {

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