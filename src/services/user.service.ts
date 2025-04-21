import {User} from '../models/User';
import {ENV_CONFIG} from '../config/env.config';
import {IUserDocument} from '../types/user.types';

export class UserService {
  static async createUser(email : string, password : string, name : string): Promise < IUserDocument > {
    const user = new User(
      {email, password, name, tokenBalance: ENV_CONFIG.INITIAL_TOKEN_BALANCE}
    );
    await user.save();
    return user;
  }

  static async findUserByEmail(email : string): Promise < IUserDocument | null > {
    return User.findOne({email});
  }

  static async findUserById(id : string): Promise < IUserDocument | null > {
    return User.findById(id);
  }
} 