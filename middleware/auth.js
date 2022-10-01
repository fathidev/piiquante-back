const jwt = require("jsonwebtoken");

function authentificationUser(req, res, next) {
  const header = req.header("Authorization");
  if (!header)
    return res
      .status(403)
      .send({ header: false, message: "Header can not be null" });

  const token = header.split(" ")[1];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.TOKEN_SECRET, function (err) {
    if (err) return res.status(401).send({ auth: false, message: err });
    next();
  });
}

module.exports = { authentificationUser };
