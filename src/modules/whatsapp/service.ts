import { env } from '../../config/env';

interface BookingConfirmationData {
  bookingId: string;
  clientName: string;
  serviceName: string;
  date: Date;
  time: string;
  amount: string;
}

export class WhatsAppService {
  private baseNumber: string;

  constructor() {
    this.baseNumber = env.WHATSAPP_NUMBER;
  }

  generateBookingConfirmation(data: BookingConfirmationData): string {
    const message = this.buildConfirmationMessage(data);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${this.baseNumber}?text=${encodedMessage}`;
  }

  private buildConfirmationMessage(data: BookingConfirmationData): string {
    const dateStr = data.date.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
New Booking Confirmation

Booking ID: ${data.bookingId.slice(0, 8)}
Client: ${data.clientName}
Service: ${data.serviceName}
Date: ${dateStr}
Time: ${data.time}
Amount: KES ${data.amount}

To confirm this booking, please reply:
CONFIRM ${data.bookingId.slice(0, 8)}

To cancel, reply:
CANCEL ${data.bookingId.slice(0, 8)}

Thank you for choosing Massage Nairobi!
    `.trim();
  }

  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    console.log(`[WhatsApp] To ${phoneNumber}: ${message}`);
  }
}
