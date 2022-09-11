const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});

const Sauce = mongoose.model("Sauce", sauceSchema);

function getSauces(req, res) {
  console.log("nous sommes dans les sauces");
  Sauce.find({}).then((sauces) => res.send(sauces));
}

function createSauce(req, res) {
  const sauceReq = JSON.parse(req.body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } =
    sauceReq;
  console.log("dans la creation des sauces");
  console.log({ body: req.body.sauce });
  console.log({ file: req.file });
  const imageUrl = req.file.destination + req.file.filename;
  console.log(imageUrl);
  const sauce = new Sauce({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: imageUrl,
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then((res) => console.log("product enregistré", res))
    .catch(console.error);
}

// Sauce.deleteMany({}).then(() =>
//   console.log("suppression de toutes les sauces de la db OK")
// );

module.exports = { createSauce, getSauces };
