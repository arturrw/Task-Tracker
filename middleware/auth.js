// Check if user is logged in
function checkLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Save user id for views
function setUser(req, res, next) {
  res.locals.currentUserId = req.session.userId || null;
  next();
}

module.exports = {
  checkLogin,
  setUser
};
