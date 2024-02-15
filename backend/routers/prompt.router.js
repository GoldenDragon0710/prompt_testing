const express = require("express");
const router = express.Router();
const promptController = require("../controllers/prompt.controller");

router.get("/", promptController.get);
router.post("/", promptController.create);
router.post("/update", promptController.update);
router.post("/delete", promptController.delete);

module.exports = router;
