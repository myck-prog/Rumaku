const express = require("express");
const router = express.Router();
const Rumaku = require("../models/rumaku");
const User = require("../models/user");
const flash = require("connect-flash");
const { isLoggedIn } = require("../middleware");

router.get("/", async (req, res) => {
  const rumakus = await Rumaku.find({});
  res.render(`rumakus/index`, { rumakus });
});

router.get("/new", isLoggedIn, (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  res.render("rumakus/new");
});

// New Rumaku Postings
router.post("/", isLoggedIn, async (req, res) => {
  const rumaku = new Rumaku(req.body.rumaku);
  await rumaku.save();
  req.flash("success", "succesfully made a new rumaku posting");
  res.redirect(`//${rumaku._id}`);
});

router.get("/:id", async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id).populate("reviews");
  res.render("rumakus/show", { rumaku });
});
// Edit Functionality
router.get("/:id/edit",isLoggedIn, async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id);
  res.render("rumakus/edit", { rumaku });
});

router.put("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const rumaku = await Rumaku.findByIdAndUpdate(id, { ...req.body.rumaku });
  req.flash("success", "succesfully update a campground");
  res.redirect(`/rumakus/${rumaku._id}`);
});

router.delete("/:id",isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Rumaku.findByIdAndDelete(id);
  res.redirect("/rumakus");
});

module.exports = router;
