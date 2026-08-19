import { FastifyRequest, FastifyReply } from 'fastify';
import { BookingService } from './service.js';
import { CreateBookingInput } from './validation.js';

export class BookingController {
  constructor(private bookingService = new BookingService()) {}

  async createBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as CreateBookingInput;
      const result = await this.bookingService.createBooking(body);
      return reply.status(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      return reply.status(400).send({
        success: false,
        error: err.message,
      });
    }
  }

  async getBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const booking = await this.bookingService.getBooking(id);
      if (!booking) {
        return reply.status(404).send({
          success: false,
          error: 'Booking not found',
        });
      }
      return reply.send({ success: true, data: booking });
    } catch (error) {
      const err = error as Error;
      return reply.status(500).send({
        success: false,
        error: err.message,
      });
    }
  }

  async getAllBookings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as { page?: string; limit?: string; status?: string };
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '50');
      const filters: { status?: string } = {};
      if (query.status) {
        filters.status = query.status;
      }
      const result = await this.bookingService.getAllBookings(page, limit, filters);
      return reply.send({ success: true, data: result });
    } catch (error) {
      const err = error as Error;
      return reply.status(500).send({
        success: false,
        error: err.message,
      });
    }
  }

  async confirmBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const booking = await this.bookingService.confirmBooking(id);
      return reply.send({ success: true, data: booking });
    } catch (error) {
      const err = error as Error;
      return reply.status(400).send({
        success: false,
        error: err.message,
      });
    }
  }

  async cancelBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const booking = await this.bookingService.cancelBooking(id);
      return reply.send({ success: true, data: booking });
    } catch (error) {
      const err = error as Error;
      return reply.status(400).send({
        success: false,
        error: err.message,
      });
    }
  }
}
