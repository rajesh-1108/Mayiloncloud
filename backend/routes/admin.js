// backend/routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

// Admin creates a user — returns a one-time tempPassword in response (NOT stored plaintext)
router.post('/create-user', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    // generate a strong temporary password
    const tempPassword = crypto.randomBytes(6).toString('base64').replace(/\+/g, 'A').replace(/\//g, 'B'); // ~8 chars
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(tempPassword, salt);

    const user = new User({ name, email, passwordHash: hash, role: role || 'user' });
    await user.save();

    // Return temp password in response (admin must copy & send to user)
    res.json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email, role: user.role }, tempPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin list users (safe fields only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('name email role createdAt');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin resets a user's password — returns a new temporary password
router.post('/reset-user-password', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const tempPassword = crypto.randomBytes(6).toString('base64').replace(/\+/g, 'A').replace(/\//g, 'B');
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(tempPassword, salt);

    // clear any reset token
    user.resetToken = undefined;
    user.resetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset', tempPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin delete user
router.delete('/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
