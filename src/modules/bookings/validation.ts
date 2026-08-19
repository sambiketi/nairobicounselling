import { z } from 'zod';

export const createBookingSchema = z.object({
  clientName: z.string().min(2).max(100),
  clientPhone: z.string().regex(/^254[0-9]{9}$/, 'Must be a valid Kenyan phone number'),
  clientEmail: z.string().email().optional(),
  serviceId: z.string().uuid(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  notes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Also export as JSON schema for Fastify
export const bookingSchemaJson = {
  type: 'object',
  required: ['clientName', 'clientPhone', 'serviceId', 'appointmentDate', 'appointmentTime'],
  properties: {
    clientName: { type: 'string', minLength: 2, maxLength: 100 },
    clientPhone: { type: 'string', pattern: '^254[0-9]{9}$' },
    clientEmail: { type: 'string', format: 'email' },
    serviceId: { type: 'string', format: 'uuid' },
    appointmentDate: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    appointmentTime: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
    notes: { type: 'string', maxLength: 500 }
  }
};
