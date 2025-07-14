import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import EventController from '@/controllers/event.controller';

class EventRoute implements Routes {
  public path = '/event';
  public router = Router();
  private eventController = new EventController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.eventController.createEvent);
    this.router.post(`${this.path}/login`, this.eventController.loginEvent);
  }
}

export default EventRoute;
