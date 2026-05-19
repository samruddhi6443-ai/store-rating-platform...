const express = require("express");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");
const { listStores } = require("../controllers/storeController");

const router = express.Router();

router.get("/", optionalAuthMiddleware, listStores);

module.exports = router;
