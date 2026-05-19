const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { createRating, updateRating } = require("../controllers/ratingController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware(["USER"]));

router.post("/", createRating);
router.put("/:id", updateRating);

module.exports = router;
