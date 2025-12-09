const express = require('express');
const router = express.Router();

const { checkLogin } = require('../middleware/auth');
const users = require('../models/userModel');

// Show profile page
router.get('/profile', checkLogin, async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await users.findById(userId);
    if (!user) {
      return res.redirect('/login');
    }

    res.render('profile', {
      user,
      error: null,
      success: null
    });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.render('profile', {
      user: null,
      error: 'Could not load profile.',
      success: null
    });
  }
});

// Update profile data
router.post('/profile', checkLogin, async (req, res) => {
  const userId = req.session.userId;
  const { name, city } = req.body;

  try {
    await users.updateUserProfile(userId, { name, city });

    const updatedUser = await users.findById(userId);

    res.render('profile', {
      user: updatedUser,
      error: null,
      success: 'Profile updated.'
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    const user = await users.findById(userId);

    res.render('profile', {
      user,
      error: 'Could not update profile. Try again.',
      success: null
    });
  }
});

module.exports = router;
