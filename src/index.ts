import express from 'express';
import { connectDB } from './config/db';
import { ENV_CONFIG } from './config/env.config';
import { logRequests } from './middleware/logger.middleware';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import { globalRateLimiter } from './config/rate-limit.config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './services/swagger';
import cors from 'cors';


const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(logRequests);
app.use(globalRateLimiter);

// Apply global rate limiting
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = ENV_CONFIG.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
