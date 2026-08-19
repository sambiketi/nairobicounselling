export const constants = {
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  } as const,

  STORAGE_BUCKETS: {
    THERAPISTS: 'therapists',
    SERVICES: 'services',
    GALLERY: 'gallery',
    LOGO: 'logo',
    BACKGROUND: 'background',
    BLOG: 'blog',
    HERO: 'hero',
  } as const,

  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours

  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
} as const;

export type BookingStatus = typeof constants.BOOKING_STATUS[keyof typeof constants.BOOKING_STATUS];
