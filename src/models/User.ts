import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  email: string;
  password: string;
  name: string;
  tokenBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6,
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
  },
  tokenBalance: { 
    type: Number, 
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export const User = model<IUser, UserModel>('User', userSchema); 