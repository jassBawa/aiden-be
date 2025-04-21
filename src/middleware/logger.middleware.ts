// logger.middleware.ts or just inside your server.ts / index.ts
import { Request, Response, NextFunction } from 'express';

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
