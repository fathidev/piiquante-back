const mongoose = require("mongoose");
const unlink = require("fs").promises.unlink;

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

// récupérer toutes les sauces
function getSauces(req, res) {
  Sauce.find({})
    .then((sauces) => res.status(200).send(sauces))
    .catch((error) => res.status(500).send(error));
}

// récupérer une sauce précise par l'id
async function getSauceById(req, res) {
  try {
    const sauce = await getSauce(req);
    return res.send(sauce).status(200);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function getSauce(req) {
  try {
    const id = req.params.id;
    const sauce = await Sauce.findById(id);
    return sauce;
  } catch (error) {
    return res.status(500).send(error);
  }
}

// supprimer une sauce
async function deleteSauce(req, res) {
  const { id } = req.params;
  try {
    const sauce = await Sauce.findByIdAndDelete(id);
    await deleteImageSauce(sauce);
    sendResponseToClient(sauce, res);
    return sauce;
  } catch (err) {
    res.status(500).send({ message: "sauce not deleted from database", err });
  }
}
// supprimer l'image d'une sauce
function deleteImageSauce(sauce) {
  const { imageUrl } = sauce;
  const imageToDelete = imageUrl.split("/").at(-1);
  console.log("imageToDelete : ", imageToDelete);
  // retourne la promesse de unlink qui est censée supprimer l'image
  // envoie la sauce au lieu de undefined prévu nativement grâce au .then(() => sauce)
  return unlink(`public/images/${imageToDelete}`).then(() => sauce);
}

// créer une sauce
function createSauce(req, res) {
  const isDatasSauceIsGood = isDatasSauceValid(req);
  const sauceReq = JSON.parse(req.body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } =
    sauceReq;

  if (isDatasSauceIsGood) {
    const imageUrl =
      process.env.PATH_RESSOURCE_URL + req.file.destination + req.file.filename;
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
      .then((sauce) =>
        res
          .status(200)
          .send({ message: "sauce registred in the database", sauce })
      )
      .catch((error) =>
        res
          .status(500)
          .send({ message: "sauce not registered in the database", error })
      );
  } else {
    res.status(400).send({ message: "data for create sauce is not valid" });
  }
}
// modifier une sauce
function modifySauce(req, res) {
  const isDatasSauceIsGood = isDatasSauceValid(req);
  if (isDatasSauceIsGood) {
    const { id } = req.params;
    const hasNewImage = req.file != null;
    const payLoad = makePayload(hasNewImage, req);
    Sauce.findByIdAndUpdate(id, payLoad)
      .then((sauce) => sendResponseToClient(sauce, res))
      .then((sauce) => deteleImage(sauce))
      .catch((err) => res.status(500).send(err));
  } else {
    res.status(400).send({ message: "data for modify sauce is not valid" });
  }
}

//  fabrication du payLoad
function makePayload(hasNewImage, req) {
  if (!hasNewImage) return req.body;
  const payLoad = JSON.parse(req.body.sauce);
  payLoad.imageUrl =
    process.env.PATH_RESSOURCE_URL + req.file.destination + req.file.filename;
  return payLoad;
}

function isDatasSauceValid(req) {
  const sauceReq = JSON.parse(req.body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } =
    sauceReq;
  const isNameValid = isDataLenghtPositive(name);
  const isManufacturerValid = isDataLenghtPositive(manufacturer);
  const isDescriptionValid = isDataLenghtPositive(description);
  const isMainPepperValid = isDataLenghtPositive(mainPepper);
  const isHeatValid = heat >= 1 && heat <= 10;
  const isUserIdValid = userId.length == 24;
  return (
    isNameValid &&
    isManufacturerValid &&
    isDescriptionValid &&
    isMainPepperValid &&
    isHeatValid &&
    isUserIdValid
  );
}

function isDataLenghtPositive(data) {
  return data.length > 0;
}

//  like & dislike
async function likeSauce(req, res) {
  const like = req.body.like;
  const userId = req.body.userId;
  // like != 0 or like != 1 or  like != -1
  if (![-1, 0, 1].includes(like)) {
    return res.status(403).send({ message: "like value invalid" });
  }

  const sauce = await getSauce(req);
  if (sauce == null)
    return res.status(404).send({ message: "sauce not found" });
  const hasUserAlreadyLiked = sauce.usersLiked.includes(userId);
  const hasUserAlreadyDisLiked = sauce.usersDisliked.includes(userId);

  if (like === 1) {
    if (hasUserAlreadyDisLiked)
      return res
        .status(403)
        .send({ message: "can't like & dislike in the same time" });
    if (hasUserAlreadyLiked) {
      return res.status(404).send({ message: "user has already liked" });
    }
    sauce.likes++;
    sauce.usersLiked.push(userId);
    sauce.save();
    res.status(200).send(sauce);
  }
  if (like === -1) {
    if (hasUserAlreadyLiked)
      return res
        .status(403)
        .send({ message: "can't like & dislike in the same time" });

    if (hasUserAlreadyDisLiked) {
      return res.status(404).send({ message: "user has already disliked" });
    }
    sauce.dislikes++;
    sauce.usersDisliked.push(userId);
    sauce.save();
    res.status(200).send(sauce);
  }

  if (like === 0) {
    if (hasUserAlreadyDisLiked) {
      sauce.dislikes--;
      const arrayWithoutUser = sauce.usersDisliked.filter((id) => id != userId);
      sauce.usersDisliked = arrayWithoutUser;
    }
    if (hasUserAlreadyLiked) {
      sauce.likes--;
      const arrayWithoutUser = sauce.usersLiked.filter((id) => id != userId);
      sauce.usersLiked = arrayWithoutUser;
    }
    sauce.save();
    res.status(200).send(sauce);
  }
}

// envoyer la réponse au client pour les routes de modification et de suppression
function sendResponseToClient(sauce, res) {
  if (sauce === null) {
    return res.status(404).send({ message: "object not found in database" });
  }
  return Promise.resolve(
    res.status(200).send({ message: "successfull : object update in database" })
  ).then(() => sauce);
}

// supprimer l'ancienne image après avoir modifié la fiche sauce
function deteleImage(sauce) {
  if (sauce === null) return;
  const imageToDelete = sauce.imageUrl.split("/").at(-1);
  unlink(`public/images/${imageToDelete}`)
    .then(() => console.log("Image deleted : ", imageToDelete))
    .catch((err) => console.error("Image not deleted : ", err));
}

// Sauce.deleteMany({}).then(() =>
//   console.log("suppression de toutes les sauces de la db OK")
// );

module.exports = {
  createSauce,
  getSauces,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce,
};
