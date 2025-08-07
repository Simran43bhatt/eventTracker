import {
  CreateAnonymousUserEventDto,
  CreateAnonymousUserEventDtoSchema,
  CreateUserEventDto,
  CreateUserEventDtoSchemaWithPhone,
  CreateUserEventDtoSchemaWithUserId,
  CreateUserEventDtoWithPhone,
  CreateUserEventDtoWithUserId,
  LoginUserEventDto,
} from "@/dto/event.dto";
import prisma from "@/utils/prisma";
import { validatePhone } from "@/utils/validators";
import { Event, Prisma } from "@prisma/client";

class EventService {
  private events = prisma.event;
  private users = prisma.user;

  private create(data: CreateUserEventDto) {
    const withUserId = CreateUserEventDtoSchemaWithUserId.safeParse(data);
    const withPhone = CreateUserEventDtoSchemaWithPhone.safeParse(data);
    const withAnonymous = CreateAnonymousUserEventDtoSchema.safeParse(data);

    return this.events.create({
      data: {
        eventName: data.eventName,
        appName: data.appName,
        metaData: data.metaData ?? {},
        ...(withUserId.success ? { userId: withUserId.data.userId } : {}),
        ...(withPhone.success ? { userId: withPhone.data.phone } : {}),
        ...(withAnonymous.success
          ? {
              eventGeneratedId: withAnonymous.data.eventGeneratedId,
            }
          : {}),
      },
    });
  }

  private async createUser(data: Prisma.UserCreateInput) {
    return this.users.create({
      data: data,
    });
  }

  private async findById(id: string) {
    return this.events.findUnique({
      where: { id },
    });
  }

  private async findByEventsGeneratedId(eventGeneratedId: string) {
    return this.events.findMany({
      where: { eventGeneratedId },
    });
  }

  private async getLoginEventByEventGeneratedId(eventGeneratedId: string) {
    const result = await this.events.findFirst({
      where: { eventGeneratedId, eventName: "login_event" },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  }

  private async getFirstEventWithUserGeneratedId(eventGeneratedId: string) {
    return this.events.findFirst({
      where: { eventGeneratedId, eventName: "login_event" },
      orderBy: { createdAt: "asc" },
    });
  }

  private async findByUserId(userId: string) {
    return this.users.findFirst({
      where: { id: userId },
    });
  }

  private async update(
    id: string,
    input: Omit<Event, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.events.update({
      where: { id },
      data: {
        ...input,
        metaData: input.metaData ?? {},
        updatedAt: new Date(),
      },
    });
  }

  private async updateMany<
    K extends keyof Omit<Event, "id" | "createdAt" | "updatedAt">,
  >(ids: string[], field: K, value: Event[K]) {
    const updateData = {
      [field]: value,
      updatedAt: new Date(),
    };
    return this.events.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });
  }

  loginEventWithUserId = async (
    event: Extract<LoginUserEventDto, { userId: string }>,
  ) => {
    if (event.eventGeneratedId) {
      const existingLoginEvent = await this.getLoginEventByEventGeneratedId(
        event.eventGeneratedId,
      );
      if (existingLoginEvent) {
        throw new Error("Login event already exists for this eventGeneratedId");
      }
      const events = await this.findByEventsGeneratedId(event.eventGeneratedId);
      const ids = events.map((event) => event.id);
      if (ids.length !== 0) {
        await this.updateMany(ids, "userId", event.userId);
      }
    }

    const createdEvent = await this.create({
      eventName: "login_event",
      appName: event.appName,
      metaData: event.metaData,
      userId: event.userId,
      eventGeneratedId: event.eventGeneratedId,
    });

    return createdEvent;
  };

  loginEventWithPhone = async (
    event: Extract<LoginUserEventDto, { phone: string }>,
  ) => {
    const { cleanPhone, countryCode, formattedPhone } = validatePhone(
      event.phone,
    );

    let user = await this.findByUserId(cleanPhone);

    if (!user) {
      user = await this.createUser({
        phone: formattedPhone,
        email: event.email || "Anonymous_User@gmail.com",
        name: event.name || "Anonymous_User",
        metaData: event.metaData ?? {},
        source: `login_event`,
      });
    }

    if (event.eventGeneratedId) {
      const existingLoginEvent = await this.getLoginEventByEventGeneratedId(
        event.eventGeneratedId,
      );
      if (existingLoginEvent) {
        throw new Error("Login event already exists for this eventGeneratedId");
      }
      const events = await this.findByEventsGeneratedId(event.eventGeneratedId);
      const ids = events.map((event) => event.id);
      if (ids.length !== 0) {
        await this.updateMany(ids, "userId", user.id);
      }
    }

    const createdEvent = await this.create({
      eventName: "login_event",
      appName: event.appName,
      metaData: event.metaData,
      userId: user.id,
      eventGeneratedId: event.eventGeneratedId,
    });

    return createdEvent;
  };

  createEventWithPhone = async (event: CreateUserEventDtoWithPhone) => {
    if (!event.phone) {
      throw new Error("phone is required");
    }

    const { cleanPhone, formattedPhone } = validatePhone(event.phone);

    let user = await this.findByUserId(cleanPhone);

    if (!user) {
      user = await this.createUser({
        phone: formattedPhone,
        email: event.metaData?.email || "Anonymous_User@gmail.com",
        name: event.metaData?.name || "Anonymous_User",
        metaData: event.metaData ?? {},
        source: `${event.appName}_${event.eventName}`,
      });
    }

    const input: CreateUserEventDto = {
      eventName: event.eventName,
      appName: event.appName,
      metaData: event.metaData,
      userId: user.id,
    };

    const createdEvent = await this.create(input);

    return createdEvent;
  };

  createEventWithAnonymous = async (event: CreateAnonymousUserEventDto) => {
    if (!event.eventGeneratedId) {
      throw new Error("eventGeneratedId is required");
    }

    const existingLoginEvent = await this.getLoginEventByEventGeneratedId(
      event.eventGeneratedId,
    );

    const input: CreateUserEventDto = {
      eventName: event.eventName,
      appName: event.appName,
      metaData: event.metaData,
    };

    if (existingLoginEvent) {
      //@ts-ignore
      input.userId = existingLoginEvent.userId;
    } else {
      input.eventGeneratedId = event.eventGeneratedId;
    }

    const createdEvent = await this.create(input);
    return createdEvent;
  };

  createEventWithUserId = async (
    event: CreateUserEventDtoWithUserId,
  ): Promise<Event> => {
    if (!event.userId) {
      throw new Error("userId or eventGeneratedId is required");
    }

    const input: CreateUserEventDto = {
      eventName: event.eventName,
      appName: event.appName,
      userId: event.userId,
      metaData: event.metaData,
    };

    const createdEvent = await this.create(input);

    if (!createdEvent) {
      throw new Error("Failed to create event");
    }

    return createdEvent;
  };
}

export default EventService;
