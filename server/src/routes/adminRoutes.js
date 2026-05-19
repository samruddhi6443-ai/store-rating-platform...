const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getDashboard,
  createUser,
  listUsers,
  getUserDetails,
  createStore,
  listStores
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware(["ADMIN"]));

router.get("/dashboard", getDashboard);
router.post("/users", createUser);
router.get("/users", listUsers);
router.get("/users/:id", getUserDetails);
router.post("/stores", createStore);
router.get("/stores", listStores);

module.exports = router;
