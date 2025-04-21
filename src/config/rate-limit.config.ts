import rateLimit from 'express-rate-limit';

// Global rate limiter
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many request from this IP, please try again later.'
});

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  // @ts-ignore
  keyGenerator: (req) => {
    const userId = req.user?._id;
    return userId !== undefined && userId !== null
      ? String(userId)
      : req.ip;
  },
  message: 'Too many requests from this user, please try again later.',
});
