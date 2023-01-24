const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const Rumaku = require("./models/rumaku");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Review = require("./models/review");

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
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //parsing the url body
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Passport handling using passport library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Fake user trial
app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "joko@gmail.com", username: "jokkk" });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

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
  const rumaku = await Rumaku.findById(req.params.id).populate("reviews");
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

app.post("/rumakus/:id/reviews", async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id);
  const review = new Review(req.body.review);
  rumaku.reviews.push(review);
  await review.save();
  await rumaku.save();
  res.redirect(`/rumakus/${rumaku._id}`);
});

app.delete("/rumakus/:id/reviews/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Rumaku.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/rumakus/${id}`);
});

// Render
app.listen(3000, () => {
  console.log("serving port 3000");
});
