import { eventQueue } from '@/queues';
import { logger } from '@/utils/logger';
import { redisConnection } from '@/utils/redis';
import { Request, Response } from 'express';

class IndexController {
  index = async (req: Request, res: Response) => {
    try {
      const redis = await redisConnection.ping();
      const eventQueueStats = await eventQueue.getJobCounts();
      res.status(200).send({
        redis,
        eventQueueStats,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).send({
        message: 'Error',
      });
    }
  };
}

export default IndexController;
