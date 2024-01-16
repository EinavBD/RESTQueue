import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  private queues: { [key: string]: string[] } = {};

  pushMessage(queueName: string, message: string): void {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    this.queues[queueName].push(message);
  }

  async popMessage(queueName: string, timeout: number): Promise<any> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const queue = this.queues[queueName];

      if (queue && queue.length > 0) {
        return queue.shift();
      }

      // Wait for a short interval before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return null;

  }
}
