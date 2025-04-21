import rateLimit from 'express-rate-limit';

// Global rate limiter
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Max 20 requests per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({error: 'Too many requests from this IP. Please try again in an hour.'});
  }
});
