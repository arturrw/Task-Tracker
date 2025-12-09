const express = require('express');
const router = express.Router();

const { checkLogin } = require('../middleware/auth');
const tasks = require('../models/taskModel');

// Check that user is logged in
router.use(checkLogin);

router.get('/tasks', async (req, res) => {
  const userId = req.session.userId;

  const filters = {
    status: req.query.status || '',
    priority: req.query.priority || ''
  };

  try {
    const taskList = await tasks.getTasksByUser(userId, filters);

    res.render('tasks/list', {
      tasks: taskList,
      filters,
      error: null
    });
  } catch (err) {
    console.error('Error loading tasks:', err);
    res.render('tasks/list', {
      tasks: [],
      filters,
      error: 'Could not load tasks. Try again.'
    });
  }
});

router.get('/tasks/create', (req, res) => {
  res.render('tasks/form', {
    mode: 'create',
    task: {
      title: '',
      description: '',
      status: 'active',
      priority: 'medium',
      category: '',
      deadline: ''
    },
    error: null
  });
});

router.post('/tasks/create', async (req, res) => {
  const userId = req.session.userId;
  const { title, description, status, priority, category, deadline } = req.body;

  const taskData = {
    title,
    description,
    status,
    priority,
    category,
    deadline: deadline || null
  };

  if (!title) {
    return res.render('tasks/form', {
      mode: 'create',
      task: taskData,
      error: 'Title is required.'
    });
  }

  try {
    await tasks.createTask(userId, taskData);
    return res.redirect('/tasks');
  } catch (err) {
    console.error('Error creating task:', err);
    return res.render('tasks/form', {
      mode: 'create',
      task: taskData,
      error: 'Could not create task. Try again.'
    });
  }
});

router.get('/tasks/:id/edit', async (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;

  try {
    const task = await tasks.getTaskById(id, userId);
    if (!task) {
      return res.redirect('/tasks');
    }

    let deadline = '';
    if (task.deadline) {
      const d = new Date(task.deadline);
      const pad = (n) => (n < 10 ? '0' + n : n);
      deadline = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    res.render('tasks/form', {
      mode: 'edit',
      task: {
        ...task,
        deadline
      },
      error: null
    });
  } catch (err) {
    console.error('Error loading task for edit:', err);
    return res.redirect('/tasks');
  }
});

router.post('/tasks/:id/edit', async (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;
  const { title, description, status, priority, category, deadline } = req.body;

  const taskData = {
    title,
    description,
    status,
    priority,
    category,
    deadline: deadline || null
  };

  if (!title) {
    return res.render('tasks/form', {
      mode: 'edit',
      task: { ...taskData, id },
      error: 'Title is required.'
    });
  }

  try {
    await tasks.updateTask(id, userId, taskData);
    return res.redirect('/tasks');
  } catch (err) {
    console.error('Error updating task:', err);
    return res.render('tasks/form', {
      mode: 'edit',
      task: { ...taskData, id },
      error: 'Could not update task. Try again.'
    });
  }
});

router.post('/tasks/:id/delete', async (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;

  try {
    await tasks.deleteTask(id, userId);
  } catch (err) {
    console.error('Error deleting task:', err);
  } finally {
    return res.redirect('/tasks');
  }
});

router.post('/tasks/:id/toggle-status', async (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;

  try {
    await tasks.toggleTaskStatus(id, userId);
  } catch (err) {
    console.error('Error toggling task status:', err);
  } finally {
    return res.redirect('/tasks');
  }
});

module.exports = router;
