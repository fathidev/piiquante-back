const { User } = require("../mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// creation du user
async function createUser(req, res) {
  const { email, password } = req.body;

  if([email, password].includes("")) {
     return res
      .status(203)
      .send({ message: "password or email can not be empty" });
  }
  const hashedPassword = await hashPassword(password);
  const user = new User({ email, password: hashedPassword });
  saveUserInDatabase(user, res);
}

// hashage du mot de passe
async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// enregistrement du nouvel utilisateur dans la DB
async function saveUserInDatabase(user, res) {
  try {
    await user.save();
    res.status(201).send({ message: "user save in database" });
  } catch (err) {
    res.status(409).send({ message: "user not save in database : " + err });
  }
}

// identification du user
async function logUser(req, res) {
  const { email, password } = req.body;
  const userFromDb = await User.findOne({ email: email }).exec();
  if (userFromDb == null) return sendError(res);
  const correctHash = userFromDb.password;
  const isPasswordCorrect = await bcrypt.compare(password, correctHash);
  if (!isPasswordCorrect) return sendError(res);
  const userId = userFromDb._id;
  if (userId == null) return sendError(res);
  const token = jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res.status(200).send({ userId, token });
}

function sendError(res) {
  res.status(401).send({ message: "wrong credentials" });
}

// User.deleteMany({}).then(() => console.log("delete all users is ok"));

module.exports = { createUser, logUser };
