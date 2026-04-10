const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user [cite: 244, 245]
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // [cite: 234, 353]
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message }); // [cite: 79, 86]
  }
};

// Login and issue Token [cite: 246, 247]
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Issue JWT [cite: 38, 53, 219]
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, token }); // [cite: 238]
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};