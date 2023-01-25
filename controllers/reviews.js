const Rumaku = require("../models/rumaku");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const rumaku = await Rumaku.findById(req.params.id);
  const review = new Review(req.body.review);
  rumaku.reviews.push(review);
  await review.save();
  await rumaku.save();
  req.flash("success", "Created new review!");
  res.redirect(`/rumakus/${rumaku._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Rumaku.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Deleted a review!");
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/rumakus/${id}`);
};

