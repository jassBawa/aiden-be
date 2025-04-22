# AidenLabs Backend Assessment

A robust backend API built with Node.js, Express, and TypeScript that provides chat functionality with OpenAI integration.

## 🚀 Live Demo

- API Documentation (Swagger UI): [http://ec2-52-22-100-218.compute-1.amazonaws.com/api-docs/](http://ec2-52-22-100-218.compute-1.amazonaws.com/api-docs/)
- API Base URL: [http://ec2-52-22-100-218.compute-1.amazonaws.com](http://ec2-52-22-100-218.compute-1.amazonaws.com)

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- OpenAI API
- Swagger/OpenAPI
- JWT Authentication
- Rate Limiting
- CORS

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API Key

## 🔧 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/jassBawa/aiden-be
   cd aidenlabs-be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables (see below).

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/chat-app
PORT=3000
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-key
INITIAL_TOKEN_BALANCE=100000
NODE_ENV=development
PROD_API_URL=http://your-production-url.com
```

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string |
| PORT | Port number for the server |
| JWT_SECRET | Secret key for JWT token generation |
| OPENAI_API_KEY | Your OpenAI API key |
| INITIAL_TOKEN_BALANCE | Initial token balance for new users |
| NODE_ENV | Environment (development/production) |
| PROD_API_URL | Production API URL (required for production) |

### Environment-Specific Configurations

- **Development**: 
  - Default port: 3000
  - API URL: `http://localhost:3000`

- **Production**:
  - Default port: 80
  - API URL: Set via `PROD_API_URL` environment variable
  - JWT expiration: 24h (configurable via `JWT_EXPIRES_IN`)
  - OpenAI model: gpt-4o-mini (configurable via `OPENAI_MODEL`)

## 📚 API Documentation

The API documentation is available through Swagger UI at:
[http://ec2-52-22-100-218.compute-1.amazonaws.com/api-docs/](http://ec2-52-22-100-218.compute-1.amazonaws.com/api-docs/)

The documentation includes:
- Authentication endpoints
- Chat endpoints

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm test` - Run tests

## 🔒 Security Features

- JWT Authentication
- Rate Limiting
- CORS Protection
- Environment Variable Protection
- Secure Password Hashing

## 📄 License

ISC
