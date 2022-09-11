// DOT ENV
require("dotenv").config();
// serveur
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const path = require("path");

// controllers
const { createUser, logUser } = require("./controller/users");
const { getSauces, createSauce } = require("./controller/sauces");

// connect to database
require("./mongo");

// Middleware
// Access-Control-Allow-Origin: *
app.use(cors());
// pour lire le contenu du body
app.use(express.json());
// pour le body form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// autoriser l'accès au dossier public/images
app.use("/public/images/", express.static("public/images"));

// authentification du user
const { authentificationUser } = require("./middleware/auth");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/images/",
  filename: makeFileName,
});
const upload = multer({ storage: storage });

function makeFileName(req, file, cb) {
  cb(null, Date.now() + "-" + file.originalname);
}
//  Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authentificationUser, getSauces);
app.post(
  "/api/sauces",
  authentificationUser,
  upload.single("image"),
  createSauce
);

// écouter le port 3000
app.listen(PORT, () => console.log(`Listening on port : ${PORT}`));
