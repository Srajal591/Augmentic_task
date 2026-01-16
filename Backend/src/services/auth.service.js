const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

const registerUser = async (name, email, password, role = 'user') => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = generateToken(user._id);
  return { user: user.toJSON(), token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);
  return { user: user.toJSON(), token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getAllUsers = async (filters = {}) => {
  const users = await User.find(filters).select('-password');
  return users;
};

const updateUser = async (userId, updateData) => {
  // Don't allow password update through this service
  delete updateData.password;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
