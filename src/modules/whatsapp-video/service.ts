import { env } from '../../config/env.js';

interface VideoSession {
  id: string;
  bookingId: string;
  counselorId: string;
  counselorWhatsApp: string;
  clientName: string;
  clientPhone: string;
  sessionTime: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  whatsappLink: string;
  sessionCode: string;
}

export class WhatsAppVideoService {
  private counselorNumber: string;

  constructor() {
    this.counselorNumber = env.WHATSAPP_NUMBER;
  }

  // Generate a unique session code
  private generateSessionCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Generate WhatsApp video call link for counselor
  private generateWhatsAppVideoLink(phoneNumber: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  // Build the session message for WhatsApp
  private buildSessionMessage(session: VideoSession): string {
    return `
🎥 *Live Counseling Session Confirmation*

*Session Code:* ${session.sessionCode}
*Client:* ${session.clientName}
*Date:* ${session.sessionTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
*Time:* ${session.sessionTime.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}

*Instructions:*
1. Click the link below to start the video call
2. Wait for your counselor to join
3. Session will last approximately 50 minutes

📞 *Click here to start your session:*
Tap the link below to begin your video call.

*Your counselor is ready to support you.*

🔒 This is a confidential and secure session.
    `.trim();
  }

  // Create a video session for client
  createClientSession(
    bookingId: string,
    counselorId: string,
    clientName: string,
    clientPhone: string,
    sessionTime: Date
  ): VideoSession {
    const sessionCode = this.generateSessionCode();
    const sessionId = `session_${Date.now()}_${sessionCode}`;

    // Message for client - they click to start the call
    const clientMessage = `
🎥 *Your Live Counseling Session*

*Session Code:* ${sessionCode}
*Counselor:* Nairobi Counseling Center
*Date:* ${sessionTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
*Time:* ${sessionTime.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}

*Click the link below to start your video session:*
📹 Start Video Call

*Please ensure you have WhatsApp installed.*

*Your counselor is waiting for you.*

🙏 Thank you for choosing Nairobi Counseling Center
    `.trim();

    const whatsappLink = this.generateWhatsAppVideoLink(
      this.counselorNumber,
      clientMessage
    );

    return {
      id: sessionId,
      bookingId,
      counselorId,
      counselorWhatsApp: this.counselorNumber,
      clientName,
      clientPhone,
      sessionTime,
      status: 'scheduled',
      whatsappLink,
      sessionCode,
    };
  }

  // Generate link for counselor (for notification)
  generateCounselorLink(session: VideoSession): string {
    const message = `
📋 *New Video Session Scheduled*

*Session Code:* ${session.sessionCode}
*Client:* ${session.clientName}
*Phone:* ${session.clientPhone}
*Date:* ${session.sessionTime.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
*Time:* ${session.sessionTime.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}

*To start the video call with the client:*
1. The client will call you via WhatsApp
2. Accept the video call
3. Provide professional counseling services

*Session Code:* ${session.sessionCode}

*Client is ready for the session.*

Please be available at the scheduled time.
    `.trim();

    return this.generateWhatsAppVideoLink(this.counselorNumber, message);
  }

  // Get session status (in production, fetch from database)
  async getSession(sessionId: string): Promise<VideoSession | null> {
    // In production, fetch from database
    // For now, return a mock session
    const mockSession: VideoSession = {
      id: sessionId,
      bookingId: 'booking_123',
      counselorId: 'counselor_123',
      counselorWhatsApp: this.counselorNumber,
      clientName: 'Client Name',
      clientPhone: '254700000000',
      sessionTime: new Date(),
      status: 'scheduled',
      whatsappLink: `https://wa.me/${this.counselorNumber}?text=Start%20Video%20Session`,
      sessionCode: this.generateSessionCode(),
    };
    return mockSession;
  }

  // Update session status
  async updateSessionStatus(sessionId: string, status: VideoSession['status']): Promise<void> {
    // In production, update database
    console.log(`Session ${sessionId} status updated to: ${status}`);
  }

  // Send reminder to client
  async sendReminder(session: VideoSession): Promise<void> {
    const reminderMessage = `
⏰ *Reminder: Your Counseling Session*

*Session Code:* ${session.sessionCode}
*Time:* ${session.sessionTime.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}

📹 Click the link to start your video call:
${session.whatsappLink}

Your counselor is looking forward to supporting you.

🔒 Confidential session
    `.trim();

    console.log(`[WhatsApp Reminder] To ${session.clientPhone}: ${reminderMessage}`);
  }
}

