import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../model/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES_IN = '7d';

export async function registerUser(userData) {
  const { email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user = new User({
    email,
    password, // Will be hashed by pre-save hook
    role: role || 'member'
  });

  await user.save();

  // Remove password from response
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
}

export async function loginUser(email, password) {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  // Remove password from response
  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    token
  };
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const userObj = user.toObject();
  delete userObj.password;
  
  return userObj;
}

