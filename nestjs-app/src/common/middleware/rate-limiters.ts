import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts per IP
  message: {
    statusCode: 429,
    success: false,
    message: 'Too many login attempts. Try again later.',
  },
});

// You can add more limiters here for other sensitive routes
