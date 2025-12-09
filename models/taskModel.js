const pool = require('../config/db');

// Get all tasks for one user
async function getTasksByUser(userId, filters = {}) {
  let sql = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [userId];

  if (filters.status && ['active', 'completed'].includes(filters.status)) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.priority && ['low', 'medium', 'high'].includes(filters.priority)) {
    sql += ' AND priority = ?';
    params.push(filters.priority);
  }

  sql += ' ORDER BY deadline IS NULL, deadline ASC, created_at DESC';

  const [rows] = await pool.query(sql, params);
  return rows;
}

// Get one task by id and user
async function getTaskById(id, userId) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ? LIMIT 1',
    [id, userId]
  );
  return rows[0];
}

// Create new task and return id
async function createTask(
  userId,
  { title, description, status, priority, category, deadline }
) {
  const [result] = await pool.query(
    'INSERT INTO tasks (user_id, title, description, status, priority, category, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      userId,
      title,
      description || null,
      status || 'active',
      priority || 'medium',
      category || null,
      deadline || null
    ]
  );

  return result.insertId;
}

// Update task data
async function updateTask(
  id,
  userId,
  { title, description, status, priority, category, deadline }
) {
  await pool.query(
    `UPDATE tasks
     SET title = ?, description = ?, status = ?, priority = ?, category = ?, deadline = ?, updated_at = NOW()
     WHERE id = ? AND user_id = ?`,
    [
      title,
      description || null,
      status || 'active',
      priority || 'medium',
      category || null,
      deadline || null,
      id,
      userId
    ]
  );
}

// Delete task
async function deleteTask(id, userId) {
  await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
    id,
    userId
  ]);
}

// Change status between active and completed
async function toggleTaskStatus(id, userId) {
  const task = await getTaskById(id, userId);
  if (!task) return;

  const newStatus = task.status === 'completed' ? 'active' : 'completed';

  await pool.query(
    'UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
    [newStatus, id, userId]
  );
}

// Get stats for dashboard
async function getTaskStats(userId) {
  const [rowsTotal] = await pool.query(
    'SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?',
    [userId]
  );
  const [rowsActive] = await pool.query(
    'SELECT COUNT(*) AS count FROM tasks WHERE user_id = ? AND status = "active"',
    [userId]
  );
  const [rowsCompleted] = await pool.query(
    'SELECT COUNT(*) AS count FROM tasks WHERE user_id = ? AND status = "completed"',
    [userId]
  );
  const [rowsNext] = await pool.query(
    `SELECT title, deadline
     FROM tasks
     WHERE user_id = ?
       AND status = "active"
       AND deadline IS NOT NULL
     ORDER BY deadline ASC
     LIMIT 1`,
    [userId]
  );

  const total = rowsTotal.length ? rowsTotal[0].total : 0;
  const active = rowsActive.length ? rowsActive[0].count : 0;
  const completed = rowsCompleted.length ? rowsCompleted[0].count : 0;
  const nextTask = rowsNext.length ? rowsNext[0] : null;

  return { total, active, completed, nextTask };
}

module.exports = {
  getTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStats
};
