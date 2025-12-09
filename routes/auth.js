const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const users = require('../models/userModel');

router.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }

  res.render('login', {
    error: null,
    email: ''
  });
});

router.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }

  res.render('register', {
    error: null,
    formData: {
      name: '',
      city: '',
      email: ''
    }
  });
});

router.post('/register', async (req, res) => {
  const { name, city, email, password } = req.body;
  const formData = { name, city, email };

  if (!email || !password) {
    return res.render('register', {
      error: 'Email and password are required.',
      formData
    });
  }

  if (password.length < 6) {
    return res.render('register', {
      error: 'Password must be at least 6 characters.',
      formData
    });
  }

  try {
    const existingUser = await users.findByEmail(email);
    if (existingUser) {
      return res.render('register', {
        error: 'User with this email already exists.',
        formData
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUserId = await users.createUser({
      name,
      city,
      email,
      passwordHash
    });

    req.session.userId = newUserId;

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error during registration:', err);
    return res.render('register', {
      error: 'Something went wrong. Try again.',
      formData
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', {
      error: 'Please enter email and password.',
      email
    });
  }

  try {
    const user = await users.findByEmail(email);
    if (!user) {
      return res.render('login', {
        error: 'Invalid email or password.',
        email
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.render('login', {
        error: 'Invalid email or password.',
        email
      });
    }

    req.session.userId = user.id;

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error during login:', err);
    return res.render('login', {
      error: 'Something went wrong. Try again.',
      email
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
    }
    res.clearCookie('connect.sid');
    return res.redirect('/login');
  });
});

module.exports = router;
