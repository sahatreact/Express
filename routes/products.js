var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");

const { body, validationResult } = require("express-validator");

const v = new Validator();

// memanggil tabel prodyct pada database
const { Products } = require("../models");

router.post(
  "/",
  body("name").isString().isLength({ min: 10 }),
  body("brand").isString(),
  body("description").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const product = await Products.create(req.body);

    res.json(product);
  }
);

module.exports = router;
