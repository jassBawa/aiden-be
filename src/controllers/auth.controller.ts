import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status-codes';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { UserService } from '../services/user.service';
import { JWTService } from '../services/jwt.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
      }

      const user = await UserService.createUser(email, password, name);
      const token = JWTService.generateToken({ _id: user._id.toString() });

      res.status(HTTP_STATUS.CREATED).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_INPUT });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: ERROR_MESSAGES.USER_NOT_REGISTERED });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
      }

      const token = JWTService.generateToken({ _id: user._id.toString() });

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: ERROR_MESSAGES.INVALID_INPUT });
    }
  }
} 