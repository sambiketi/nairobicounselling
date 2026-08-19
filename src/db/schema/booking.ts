import { pgTable, uuid, text, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]);

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  clientEmail: text('client_email'),
  serviceId: uuid('service_id').notNull(),
  appointmentDate: timestamp('appointment_date').notNull(),
  appointmentTime: text('appointment_time').notNull(),
  notes: text('notes'),
  status: bookingStatusEnum('status').default('pending'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  mpesaTransactionId: text('mpesa_transaction_id'),
  paymentStatus: text('payment_status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
