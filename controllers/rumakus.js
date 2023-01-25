const Rumaku = require("../models/rumaku");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken =
  "pk.eyJ1IjoibXlja2xhbmRsZWFybnByb2ciLCJhIjoiY2xkYjF6Y2Q1MDdqajNwa2hqdWYwM3BvbCJ9.D9RoH3UAyGf9z_M-2G2gIg";
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const rumakus = await Rumaku.find({});
  res.render(`rumakus/index`, { rumakus });
};

module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be signed in");
    return res.redirect("/login");
  }
  res.render("rumakus/new");
};

module.exports.createRumaku = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.rumaku.location,
      limit: 1,
    })
    .send();
  const rumaku = new Rumaku(req.body.rumaku);
  rumaku.geometry = geoData.body.features[0].geometry;
  await rumaku.save();
  req.flash("success", "succesfully made a new rumaku posting");
  res.redirect(`/rumakus/${rumaku._id}`);
};
module.exports.showRumaku = async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id).populate("reviews");
  res.render("rumakus/show", { rumaku });
};
module.exports.renderEditForm = async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id);
  res.render("rumakus/edit", { rumaku });
};
module.exports.updateRumaku = async (req, res) => {
  const { id } = req.params;
  const rumaku = await Rumaku.findByIdAndUpdate(id, { ...req.body.rumaku });
  req.flash("success", "succesfully update a campground");
  res.redirect(`/rumakus/${rumaku._id}`);
};
module.exports.deleteRumaku = async (req, res) => {
  const { id } = req.params;
  await Rumaku.findByIdAndDelete(id);
  res.redirect("/rumakus");
};
