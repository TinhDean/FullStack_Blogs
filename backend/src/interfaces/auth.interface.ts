import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string | Date;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}
