// database
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const login = process.env.DB_LOGIN;
const password = process.env.DB_PASSWORD;
const db = process.env.DB_NAME;
const uri = `mongodb+srv://${login}:${password}@cluster0.rnu2lb8.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("connected to mango!"))
  .catch((err) => console.error("Error connecting to Mongo", error));

// moule userschema
const userSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});
// application d'un plugin à userSchema qui permet de s'assurer que l'utilisateur est unique
userSchema.plugin(uniqueValidator);

// objet user qui invoque le modele userschema
const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
