module.exports.isLoggedIn = (req, res, next) => {
  
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash("error", "you must be signed in first");
    return res.redirect("/login");
  }
  next();
};
