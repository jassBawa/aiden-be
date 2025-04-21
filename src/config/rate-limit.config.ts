import rateLimit from 'express-rate-limit';

// Global rate limiter
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log('hello from lgobal')
    res
      .status(429)
      .json({
        error: 'Too many requests from this IP. Please try again in an hour.',
      });
  },
});
export const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 4,
  // @ts-ignore
  keyGenerator: (req) => {
    console.log('req',req)
    const userId = req.user?._id;
    return userId !== undefined && userId !== null
      ? String(userId)
      : req.ip;
  },
  message: 'Too many requests from this user, please try again later.',
});
