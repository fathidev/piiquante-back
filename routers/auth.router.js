const express = require("express");
const authRouter = express.Router();
const { createUser, logUser } = require("../controller/users");

authRouter.post("/signup", createUser);
authRouter.post("/login", logUser);

module.exports = { authRouter };
