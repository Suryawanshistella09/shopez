const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Map userType from frontend to role in database
    const role = userType === 'Admin' ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: userType || 'Customer' // Send back the capitalized version
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // Map role from database to frontend format
    const userRole = user.role === 'admin' ? 'Admin' : 'Customer';

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: userRole
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map role from database to frontend format
    const userRole = user.role === 'admin' ? 'Admin' : 'Customer';

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: userRole,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
