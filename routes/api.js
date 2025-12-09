const express = require('express');
const router = express.Router();

const { checkLogin } = require('../middleware/auth');
const users = require('../models/userModel');
const { getCityWeather } = require('../services/weatherService');

// Protect all API routes
router.use(checkLogin);

router.get('/weather', async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await users.findById(userId);

    if (!user || !user.city) {
      return res.json({
        ok: false,
        reason: 'no_city',
        message: 'City is not set in profile.'
      });
    }

    try {
      const weather = await getCityWeather(user.city);

      return res.json({
        ok: true,
        weather
      });
    } catch (err) {
      console.error('Error calling weather service:', err.message);
      return res.json({
        ok: false,
        reason: 'api_error',
        message: 'Could not load weather data.'
      });
    }
  } catch (err) {
    console.error('Error in /api/weather:', err);
    return res.status(500).json({
      ok: false,
      reason: 'server_error',
      message: 'Server error.'
    });
  }
});

module.exports = router;
