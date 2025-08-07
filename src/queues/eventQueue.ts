import { redisConnection } from '@/utils/redis';
import { Queue } from 'bullmq';

export const eventQueue = () => {
  const queue = new Queue("event-queue", {
    connection: redisConnection,
  });

  return queue;
};
