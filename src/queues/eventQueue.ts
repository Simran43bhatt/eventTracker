import { redisConnection } from '@/utils/redis';
import { Queue } from 'bullmq';

export const eventQueue = new Queue('event-queue', {
  connection: redisConnection,
});
