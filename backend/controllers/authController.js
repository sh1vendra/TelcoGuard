const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { formatResponse } = require('../utils/helpers');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json(formatResponse(false, null, 'Email already registered'));
    }
    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id, user.role);
    res.status(201).json(formatResponse(true, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Registered successfully'));
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json(formatResponse(false, null, 'Invalid credentials'));
    }
    const token = generateToken(user._id, user.role);
    res.json(formatResponse(true, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful'));
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const { _id: id, name, email, role, createdAt } = req.user;
  res.json(formatResponse(true, { id, name, email, role, createdAt }, ''));
};

module.exports = { register, login, getMe };
