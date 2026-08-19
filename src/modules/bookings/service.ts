import { BookingRepository } from '../../db/repositories/booking-repository';
import { ServiceRepository } from '../../db/repositories/service-repository';
import { constants } from '../../config/constants';
import { WhatsAppService } from '../whatsapp/service';
import { MpesaService } from '../mpesa/service';

export class BookingService {
  constructor(
    private bookingRepository = new BookingRepository(),
    private serviceRepository = new ServiceRepository(),
    private whatsappService = new WhatsAppService(),
    private mpesaService = new MpesaService()
  ) {}

  async createBooking(input: any): Promise<any> {
    const service = await this.serviceRepository.findById(input.serviceId);
    if (!service) throw new Error('Service not found');
    if (!service.isActive) throw new Error('Service is not available');

    const appointmentDate = new Date(input.appointmentDate);
    if (isNaN(appointmentDate.getTime())) throw new Error('Invalid appointment date');

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (appointmentDate < now) throw new Error('Cannot book appointments in the past');

    const conflicts = await this.bookingRepository.findConflicts(
      appointmentDate,
      input.appointmentTime
    );
    if (conflicts.length > 0) throw new Error('Time slot is already booked');

    const booking = await this.bookingRepository.create({
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientEmail: input.clientEmail,
      serviceId: input.serviceId,
      appointmentDate,
      appointmentTime: input.appointmentTime,
      notes: input.notes,
      status: constants.BOOKING_STATUS.PENDING,
      amount: service.price,
      paymentStatus: 'pending',
    });

    const whatsappLink = this.whatsappService.generateBookingConfirmation({
      bookingId: booking.id,
      clientName: booking.clientName,
      serviceName: service.name,
      date: booking.appointmentDate,
      time: booking.appointmentTime,
      amount: booking.amount,
    });

    const mpesaInstructions = await this.mpesaService.generatePaymentInstructions(booking);

    return { booking, whatsappLink, mpesaInstructions };
  }

  async confirmBooking(bookingId: string): Promise<any> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status === constants.BOOKING_STATUS.CANCELLED) {
      throw new Error('Cannot confirm a cancelled booking');
    }
    return await this.bookingRepository.updateStatus(bookingId, constants.BOOKING_STATUS.CONFIRMED);
  }

  async cancelBooking(bookingId: string): Promise<any> {
    return await this.bookingRepository.updateStatus(bookingId, constants.BOOKING_STATUS.CANCELLED);
  }

  async completeBooking(bookingId: string): Promise<any> {
    return await this.bookingRepository.updateStatus(bookingId, constants.BOOKING_STATUS.COMPLETED);
  }

  async getBooking(id: string): Promise<any> {
    return await this.bookingRepository.findById(id);
  }

  async getAllBookings(page = 1, limit = 50, filters?: { status?: string }) {
    return await this.bookingRepository.findAll(page, limit);
  }
}
