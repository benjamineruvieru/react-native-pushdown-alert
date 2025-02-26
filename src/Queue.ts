import type { OpenAlertData } from './types';

export default class Queue {
  private queue: OpenAlertData[];

  constructor() {
    this.queue = [];
  }

  get size(): number {
    return this.queue.length;
  }

  enqueue(data: OpenAlertData): void {
    this.queue.push(data);
  }

  dequeue(): OpenAlertData | undefined {
    return this.queue.shift();
  }
}
