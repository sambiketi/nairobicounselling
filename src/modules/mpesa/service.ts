import { env } from '../../config/env.js';
import { Booking } from '../../db/schema/booking.js';

interface MpesaTokenResponse {
  access_token: string;
  expires_in: string;
}

interface MpesaStkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  ResultCode?: string;
  ResultDesc?: string;
}

export class MpesaService {
  private consumerKey: string;
  private consumerSecret: string;
  private shortcode: string;
  private passkey: string;
  private callbackUrl: string;
  private baseUrl: string;

  constructor() {
    this.consumerKey = env.MPESA_CONSUMER_KEY;
    this.consumerSecret = env.MPESA_CONSUMER_SECRET;
    this.shortcode = env.MPESA_SHORTCODE;
    this.passkey = env.MPESA_PASSKEY;
    this.callbackUrl = env.MPESA_CALLBACK_URL || '';
    this.baseUrl = env.NODE_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

    const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json() as MpesaTokenResponse;
    return data.access_token;
  }

  async stkPush(phoneNumber: string, amount: string, accountReference: string): Promise<MpesaStkPushResponse> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');

    const requestData = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: this.callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: 'Massage Nairobi Booking',
    };

    const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`STK Push failed: ${response.statusText}`);
    }

    return await response.json() as MpesaStkPushResponse;
  }

  async queryStatus(checkoutRequestId: string): Promise<MpesaQueryResponse> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');

    const requestData = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Query status failed: ${response.statusText}`);
    }

    return await response.json() as MpesaQueryResponse;
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    try {
      const result = await this.queryStatus(transactionId);
      return result.ResultCode === '0';
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  async generatePaymentInstructions(booking: Booking): Promise<string> {
    const reference = `BOOKING-${booking.id.slice(0, 8)}`;

    return `
M-Pesa Payment Instructions:
1. Go to M-Pesa menu
2. Select Lipa Na M-Pesa
3. Select Pay Bill
4. Enter Business Number: ${this.shortcode}
5. Enter Account Number: ${reference}
6. Enter Amount: KES ${booking.amount}
7. Enter your PIN
8. Confirm payment
    `.trim();
  }

  private getTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
