const express = require("express");
const { getProperties, getProperty } = require("../controllers/propertiesController");
const router = express.Router();


router.get("/", getProperties);
router.get("/:listingKey", getProperty);

module.exports = router;