module.exports = (req, res, next) => {
  if ((req.user && req.user.permission !== "Admin") || !req.user) {
    return res.redirect("/");
  }
  next();
};
