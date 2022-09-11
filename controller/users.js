const { User } = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = new User({ email, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send({ message: "user enregistré dans la database" });
  } catch (err) {
    res
      .status(409)
      .send({ message: "user non enregistré dans la database : " + err });
  }
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function logUser(req, res) {
  const { email, password } = req.body;
  const userFromDb = await User.findOne({ email: email }).exec();
  if (userFromDb == null) return sendError(res);
  const correctHash = userFromDb.password;
  const isPasswordCorrect = await bcrypt.compare(password, correctHash);
  if (!isPasswordCorrect) return sendError(res);
  const userId = userFromDb._id;
  const token = jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res.status(200).send({ userId, token });
}

function sendError(res) {
  res.status(401).send({ message: "wrong credentials" });
}

// User.deleteMany({}).then(() => console.log("delete all ok"));

module.exports = { createUser, logUser };
