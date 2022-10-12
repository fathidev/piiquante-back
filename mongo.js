const mongoose = require("mongoose");
// plugin pour vérifier que l'email est unique
const uniqueValidator = require("mongoose-unique-validator");
// plugin pourvérifier que la saisie correspond à un email
const { isEmail: isEmailValidator } = require("validator");

// récupération des variables d'environnement
const login = process.env.DB_LOGIN,
  password = process.env.DB_PASSWORD,
  db = process.env.DB_NAME;
const uri = `mongodb+srv://${login}:${password}@cluster0.rnu2lb8.mongodb.net/${db}?retryWrites=true&w=majority`;

// connection à la base de données

mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo", err));

// moule userschema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: [isEmailValidator, "invalidate email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

// application d'un plugin à userSchema qui permet de s'assurer que l'utilisateur est unique
userSchema.plugin(uniqueValidator);

// objet User qui invoque le modele userschema
const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
