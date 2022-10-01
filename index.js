// DOT ENV
require("dotenv").config();
// serveur
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

const { saucesRouter } = require("./routers/sauces.router");
const { authRouter } = require("./routers/auth.router");

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

app.use("/api/sauces", saucesRouter);
app.use("/api/auth", authRouter);

// écouter le port 3000
app.listen(PORT, () => console.log(`Listening on port : ${PORT}`));
