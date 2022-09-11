const jwt = require("jsonwebtoken");

function authentificationUser(req, res, next) {
  const header = req.header("Authorization");
  if (header == null) return res.status(403).send("Header cannot be null");

  const token = header.split(" ")[1];
  if (token == null) return res.status(403).send("Token cannot be null");

  const isTokenValid = jwt.verify(token, process.env.TOKEN_SECRET);
  if (isTokenValid) return next();
  res.status(403).send("user unauthorised");
}

module.exports = { authentificationUser };
