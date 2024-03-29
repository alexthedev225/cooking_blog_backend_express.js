// Importez les modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/UserRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const articleRoutes = require("./routes/ArticleRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const socketHandler = require("./socketHandler"); // Nouveau module pour la gestion de Socket.io

const app = express();
app.use(
  cors({
    origin: ["https://cooking-fever.vercel.app", "http://localhost:3000"], // Remplacez par l'URL de votre frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Autorisez les cookies, si nécessaire
  })
);

require("dotenv").config();

const PORT = process.env.PORT;
const server = http.createServer(app);
socketHandler.init(server); // Initialisez Socket.io avec le serveur

const MONGO_DB_URI = process.env.MONGO_DB_URI;

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("Base de données connectée avec succès");
    server.listen(PORT, () => {
      console.log(`App listening on PORT http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));

app.head("/", (req, res) => {
  res.status(200).end();
});

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

app.post("/envoyer-email", (req, res) => {
  const { email, message, nom } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "L'e-mail et le message sont obligatoires." });
  }

  const data = {
    from: email,
    to: "alexcode225@gmail.com", 
    subject: `message de ${nom}`,
    text: `E-mail: ${email}\nMessage: ${message}`,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail", error);
      res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
    } else {
      console.log("E-mail envoyé avec succès", body);
      res.json({ message: "E-mail envoyé avec succès" });
    }
  });
});


app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
