const pool = require('../config/db');

// Get user by email
async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0];
}

// Get user by id
async function findById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0];
}

// Create new user and return its id
async function createUser({ name, city, email, passwordHash }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, city, email, password_hash) VALUES (?, ?, ?, ?)',
    [name || null, city || null, email, passwordHash]
  );

  return result.insertId;
}

// Update user name and city
async function updateUserProfile(id, { name, city }) {
  await pool.query(
    'UPDATE users SET name = ?, city = ? WHERE id = ?',
    [name || null, city || null, id]
  );
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateUserProfile
};
