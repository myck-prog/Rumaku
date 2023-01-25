const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Rumaku = require("./models/rumaku");
const User = require("./models/user");
const Review = require("./models/review");


const rumakusRoute = require("./routes/rumakus");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");

// Database connection
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
// Middleware config
app.use(express.urlencoded({ extended: true })); //parsing the url body
app.use(methodOverride("_method"));

// Session config & flash
const sessionConfig = {
  secret: "secretkeysclear!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(express.static("public"));
app.use(flash());

// Passport handling using passport library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware setting for flash success.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/rumakus", rumakusRoute);
app.use("/rumakus/:id/reviews", reviewRoutes);

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// // Not found page
// app.all("*", (req, res, next) => {
//   const error = new Error("Not found");
//   error.status = 404;
//   next(error);
// });

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});
// Render
app.listen(3000, () => {
  console.log("serving port 3000");
});
