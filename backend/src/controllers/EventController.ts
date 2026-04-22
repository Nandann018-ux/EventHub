import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/authMiddleware';


export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, date, location, capacity } = req.body;
    const organizerId = req.userId;

    if (!organizerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: Number(capacity),
        organizerId,
      },
    });

    res.status(201).json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};


export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};


export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};


export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, capacity } = req.body;
    const userId = req.userId;

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the organizer of this event' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
        capacity: capacity ? Number(capacity) : undefined,
      },
    });

    res.status(200).json(updatedEvent);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};


export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the organizer of this event' });
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};
