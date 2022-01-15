module.exports = (req, res, next) => {
  if ((req.user && req.user.permission !== "Student") || !req.user) {
    return res.redirect("/");
  }
  next();
};
