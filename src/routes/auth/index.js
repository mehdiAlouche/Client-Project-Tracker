import { Router } from 'express';
import { registerUser, loginUser } from '#@/modules/auth/index.js';

const router = Router();

// POST /auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await registerUser(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// POST /auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await loginUser(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

