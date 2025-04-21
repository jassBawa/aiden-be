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


export const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  keyGenerator: (req) => {
    // Safely access user._id if it exists, otherwise fallback to IP
    const userId = (req as any).usser?._id;
    console.log(userId)
    return userId || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  },
});