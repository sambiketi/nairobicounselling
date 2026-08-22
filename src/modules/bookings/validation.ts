import { z } from 'zod';

export const createBookingSchema = z.object({
  clientName: z.string().min(2).max(100),
  clientPhone: z.string().regex(/^254[0-9]{9}$/, 'Must be a valid Kenyan phone number'),
  clientEmail: z.string().email().optional(),
  serviceId: z.string().uuid(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  notes: z.string().max(500).optional(),
  sessionType: z.enum(['in-person', 'online', 'phone']).default('in-person'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
