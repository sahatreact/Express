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

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  let product = await Products.findByPk(id);

  if (!product) {
    return res.json({ message: "Product not found" });
  }

  const schema = {
    name: "string|optional",
    brand: "string|optional",
    description: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  product = await product.update(req.body);

  res.json(product);
});

module.exports = router;
