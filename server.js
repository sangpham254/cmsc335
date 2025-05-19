const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const { MongoClient } = require("mongodb");

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const uri = process.env.MONGO_URI;
const db = process.env.MONGO_DB;
const collection = process.env.MONGO_COLLECTION;
const client = new MongoClient(uri);

app.get("/", async (req, res) => {
  await client.connect();
  const comments = await client.db(db).collection(collection).find({}).toArray();
  let commentsHtml = comments.length
    ? comments.map(c => `<tr><td>${c.username}: ${c.comment}</td></tr>`).join("")
    : "<tr><td>No comments yet</td></tr>";

  res.render("index", { commentsHtml });
});

app.get("/search", async (req, res) => {
  const name = req.query.pokemon?.toLowerCase();

  if (!name) {
    return res.render("invalid", { message: "No Pokémon name provided." });
  }

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = response.data;

    const stats = {
      name: data.name,
      id: data.id,
      sprite: data.sprites.front_default,
      types: data.types.map(t => t.type.name).join(", "),
      height: data.height,
      weight: data.weight
    };

    res.render("result", { stats });
  } catch (error) {
    res.render("invalid", { message: `Pokémon '${name}' not found.` });
  }
});

app.post("/comment", async (req, res) => {
  const { username, comment } = req.body;
  await client.connect();
  await client.db(db).collection(collection).insertOne({ username, comment });
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
