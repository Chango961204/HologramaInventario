function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "No tienes permisos (ADMIN)" });
  }

  next();
}

module.exports = adminMiddleware;
