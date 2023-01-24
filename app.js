const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const Rumaku = require("./models/rumaku");

mongoose.connect("mongodb://localhost:27017/rumaku", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
// using engine
app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //parsing the url body
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/rumakus", async (req, res) => {
  const rumakus = await Rumaku.find({});
  res.render(`rumakus/index`, { rumakus });
});

app.get("/rumakus/new", (req, res) => {
  res.render("rumakus/new");
});

app.post("/rumakus", async (req, res) => {
  const rumaku = new Rumaku(req.body.rumaku);
  await rumaku.save();
  res.redirect(`/rumakus/${rumaku._id}`);
});

app.get("/rumakus/:id", async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id);
  res.render("rumakus/show", { rumaku });
});
// Edit Functionality
app.get("/rumakus/:id/edit", async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id);
  res.render("rumakus/edit", { rumaku });
});

app.put("/rumakus/:id", async (req, res) => {
  const { id } = req.params;
  const rumaku = await Rumaku.findByIdAndUpdate(id, { ...req.body.rumaku });
  res.redirect(`/rumakus/${rumaku._id}`);
});

app.delete("/rumakus/:id", async (req, res) => {
  const { id } = req.params;
  await Rumaku.findByIdAndDelete(id);
  res.redirect("/rumakus");
});

// Render
app.listen(3000, () => {
  console.log("serving port 3000");
});
