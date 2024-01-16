import { Controller, Post, Body, Query, Param, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('api')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post(':queue_name')
  pushMessage(@Body() { message }: { message: string }, @Param('queue_name') queueName: string): void {
    this.messagesService.pushMessage(queueName, message);
  }

  @Get(':queue_name')
  async popMessage(
    @Param('queue_name') queueName: string,
    @Query('timeout') timeout: number = 10000,
  ): Promise<any> {
    const message = await this.messagesService.popMessage(queueName, timeout);

    if (message === null) {
      return { statusCode: 204, message: 'No message available after timeout' };
    }

    return { statusCode: 200, message };
  }
}
