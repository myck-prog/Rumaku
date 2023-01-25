const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");
const Rumaku = require("../models/rumaku");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");

router.post("/", reviews.createReview, isLoggedIn);

router.delete("/:reviewId", reviews.deleteReview, isLoggedIn);

module.exports = router;
