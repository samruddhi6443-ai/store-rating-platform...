const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getOwnerDashboard } = require("../controllers/ownerController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware(["STORE_OWNER"]));

router.get("/dashboard", getOwnerDashboard);

module.exports = router;
