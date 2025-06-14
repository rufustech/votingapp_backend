function verifyInternalRequest(req, res, next) {
  const token = req.headers["x-api-key"];

  if (!token || token !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ message: "Forbidden: Unauthorized access" });
  }

  next();
}

module.exports = { verifyInternalRequest };
