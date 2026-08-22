import { FastifyInstance } from 'fastify';
import { BookingController } from './controller.js';
import { createBookingSchema } from './validation.js';

export async function bookingRoutes(fastify: FastifyInstance) {
  const controller = new BookingController();

  fastify.post('/api/book', {
    schema: {
      body: {
        type: 'object',
        required: ['clientName', 'clientPhone', 'serviceId', 'appointmentDate', 'appointmentTime'],
        properties: {
          clientName: { type: "string", minLength: 2, maxLength: 100 },
          clientPhone: { type: "string", pattern: "^254[0-9]{9}$" },
          clientEmail: { type: "string", format: "email" },
          serviceId: { type: "string", format: "uuid" },
          appointmentDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          appointmentTime: { type: "string", pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$" },
          notes: { type: "string", maxLength: 500 },
          sessionType: { type: "string", enum: ["in-person", "online", "phone"], default: "in-person" }
        }
          clientName: { type: 'string', minLength: 2, maxLength: 100 },
          clientPhone: { type: 'string', pattern: '^254[0-9]{9}$' },
          clientEmail: { type: 'string', format: 'email' },
          serviceId: { type: 'string', format: 'uuid' },
          appointmentDate: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          appointmentTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
          notes: { type: 'string', maxLength: 500 }
        }
      }
    },
  }, controller.createBooking.bind(controller));

  fastify.get('/api/bookings', controller.getAllBookings.bind(controller));
  fastify.get('/api/bookings/:id', controller.getBooking.bind(controller));
  fastify.put('/api/bookings/:id/confirm', controller.confirmBooking.bind(controller));
  fastify.put('/api/bookings/:id/cancel', controller.cancelBooking.bind(controller));
}
