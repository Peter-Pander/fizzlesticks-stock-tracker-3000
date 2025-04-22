import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Product from '../models/product.model.js';
import { v4 as uuidv4 } from 'uuid';

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const user = new User({ email, password });
    await user.save();
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: return current user details
const getMe = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login as Demo User (clones Bob)
const demoLogin = async (req, res) => {
  try {
    // Find original Bob user
    const original = await User.findOne({ email: "bob@example.com" });
    if (!original) {
      return res.status(404).json({ message: "Demo user not found" });
    }

    // Create a new temp user
    const tempEmail = `demo-${uuidv4()}@example.com`;
    const hashedPassword = await bcrypt.hash("secret", 10);
    const tempUser = await User.create({ email: tempEmail, password: hashedPassword });

    // Copy Bob's products to this user
    const bobsProducts = await Product.find({ user: original._id });
    const copiedProducts = bobsProducts.map((p) => ({
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      picture: p.picture,
      user: tempUser._id
    }));
    await Product.insertMany(copiedProducts);

    // Create JWT token for the temp user
    const token = jwt.sign(
      { id: tempUser._id, email: tempUser.email },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, email: tempUser.email });
  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({ message: "Demo login failed" });
  }
};

export { register, login, getMe, demoLogin };
