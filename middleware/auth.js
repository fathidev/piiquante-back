const jwt = require("jsonwebtoken");
function authentificationUser(req, res, next) {
  const header = req.header("Authorization");
  if (header == null) return res.status(403).send("Header can not be null");

  const token = header.split(" ")[1];
  if (token == null) return res.status(403).send("Token can not be null");

  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });
  jwt.verify(token, process.env.TOKEN_SECRET, function (err) {
    if (err) return res.status(401).send({ auth: false, message: err });
    next();
  });
}

module.exports = { authentificationUser };
