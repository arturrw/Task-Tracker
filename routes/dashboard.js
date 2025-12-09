const express = require('express');
const router = express.Router();

const { checkLogin } = require('../middleware/auth');
const users = require('../models/userModel');
const tasks = require('../models/taskModel');

// Dashboard with task stats
router.get('/dashboard', checkLogin, async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await users.findById(userId);
    const stats = await tasks.getTaskStats(userId);

    res.render('dashboard', {
      user,
      stats,
      error: null
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.render('dashboard', {
      user: null,
      stats: {
        total: 0,
        active: 0,
        completed: 0,
        nextTask: null
      },
      error: 'Could not load dashboard data. Try again.'
    });
  }
});

module.exports = router;
