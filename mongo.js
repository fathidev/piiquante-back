// database
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const isEmailValidator = require("validator").isEmail;
const isLenghtValidator = require("validator").isLength;

const login = process.env.DB_LOGIN,
  password = process.env.DB_PASSWORD,
  db = process.env.DB_NAME;
const uri = `mongodb+srv://${login}:${password}@cluster0.rnu2lb8.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("connected to mango!"))
  .catch((err) => console.error("Error connecting to Mongo", err));

// moule userschema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    validate: [isEmailValidator, "invalidate email"],
  },
  password: {
    type: String,
    required: [true, "invalid password"],
  },
});

// function isPasswordRequired() {
//   console.log(this.password);
//   return typeof this.password === "string" ? false : true;
// }
// application d'un plugin à userSchema qui permet de s'assurer que l'utilisateur est unique
userSchema.plugin(uniqueValidator);

// objet user qui invoque le modele userschema
const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
