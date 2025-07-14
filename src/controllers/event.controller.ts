import {
  CreateAnonymousUserEventDtoSchema,
  CreateUserEventDtoSchema,
  LoginUserEventDtoSchema,
  LoginUserEventDtoWithUserIdSchema
} from '@/dto/event.dto';
import { eventQueue } from '@/queues';
import { logger } from '@/utils/logger';
import { validate } from '@/utils/vaildateZodSchema';
import { createId } from '@paralleldrive/cuid2';
import { NextFunction, Request, Response } from 'express';

class EventController {
  private eventQueue = eventQueue;

  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validData = validate(CreateUserEventDtoSchema)(req.body);

      if (validData.eventName === 'login_event') {
        throw new Error('Login event can only be created with /login endpoint');
      }

      const eventForAnonymous = CreateAnonymousUserEventDtoSchema.safeParse(validData);

      if (eventForAnonymous.success && !eventForAnonymous.data?.eventGeneratedId) {
        eventForAnonymous.data.eventGeneratedId = createId();
      }

      const dataToCreateEvent = { ...validData, ...(eventForAnonymous.success ? eventForAnonymous.data : {}) };

      this.eventQueue.add('create-event', dataToCreateEvent, {
        attempts: 10,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });

      res.status(202).json({ message: 'Event added to queue', data: dataToCreateEvent });
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

  loginEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validData = validate(LoginUserEventDtoSchema)(req.body);

      const eventForUserId = LoginUserEventDtoWithUserIdSchema.safeParse(validData);
      if (eventForUserId.success) {
        // const events = await eventService.loginEventWithUserId(eventForUserId.data);
        res.status(200).json({ message: 'Events updated', data: {} });
        return;
      }

      res.status(400).json({ message: 'could not create event', data: {} });
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}

export default EventController;
