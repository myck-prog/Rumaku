const express = require("express");
const router = express.Router();
const Rumaku = require("../models/rumaku");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");
const rumakus = require("../controllers/rumakus");

router.route("/").get(rumakus.index).post(isLoggedIn, rumakus.createRumaku);

router.get("/new", isLoggedIn, rumakus.renderNewForm);

router.get("/:id", rumakus.showRumaku);
// Edit Functionality
router.get("/:id/edit", isLoggedIn, rumakus.renderEditForm);

router.put("/:id", isLoggedIn, rumakus.updateRumaku);

router.delete("/:id", isLoggedIn, rumakus.deleteRumaku);

module.exports = router;
