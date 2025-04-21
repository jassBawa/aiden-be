import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '../../src/controllers/auth.controller';
import { UserService } from '../../src/services/user.service';
import { JWTService } from '../../src/services/jwt.service';
import { ERROR_MESSAGES } from '../../src/constants/error-messages';
import { HTTP_STATUS } from '../../src/constants/http-status-codes';

// Reusable mock response
const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockUser = {
  _id: 'mockUserId',
  email: 'test@example.com',
  name: 'John Doe',
  comparePassword: vi.fn(),
};

describe('AuthController', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'John Doe',
        },
      } as any;
      const res = mockResponse();

      vi.spyOn(UserService, 'findUserByEmail').mockResolvedValueOnce(null);
      vi.spyOn(UserService, 'createUser').mockResolvedValueOnce(mockUser as any);
      vi.spyOn(JWTService, 'generateToken').mockReturnValue('mockToken');

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 'mockUserId',
          email: 'test@example.com',
          name: 'John Doe',
        },
        token: 'mockToken',
      });
    });

    it('should not register if email already exists', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'John Doe',
        },
      } as any;
      const res = mockResponse();

      vi.spyOn(UserService, 'findUserByEmail').mockResolvedValueOnce(mockUser as any);

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      });
    });
  });

  describe('login', () => {
    it('should log in a registered user and return token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      } as any;
      const res = mockResponse();

      mockUser.comparePassword = vi.fn().mockResolvedValueOnce(true);
      vi.spyOn(UserService, 'findUserByEmail').mockResolvedValueOnce(mockUser as any);
      vi.spyOn(JWTService, 'generateToken').mockReturnValue('mockToken');

      await AuthController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 'mockUserId',
          email: 'test@example.com',
          name: 'John Doe',
        },
        token: 'mockToken',
      });
    });

    it('should not log in if user not found', async () => {
      const req = {
        body: {
          email: 'notfound@example.com',
          password: 'password123',
        },
      } as any;
      const res = mockResponse();

      vi.spyOn(UserService, 'findUserByEmail').mockResolvedValueOnce(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.USER_NOT_REGISTERED,
      });
    });

    it('should not log in if password is incorrect', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      } as any;
      const res = mockResponse();

      mockUser.comparePassword = vi.fn().mockResolvedValueOnce(false);
      vi.spyOn(UserService, 'findUserByEmail').mockResolvedValueOnce(mockUser as any);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    });
  });
});
