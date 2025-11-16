const express = require("express");
const { registerUser, loginUser, refreshTokenUser, logoutUser, getUsers } = require("../controllers/userController");

const router = express.Router();


router.post("/register", registerUser);
router.get("/users", getUsers);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.post("/logout", logoutUser);

module.exports = router;
