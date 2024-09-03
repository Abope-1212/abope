const path = require("path");

const express = require("express");
const { body } = require("express-validator/lib");

const admincontroller = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const Router = express.Router();

Router.get("/add-product", isAuth, admincontroller.getAddproduct);
Router.post(
  "/add-product",
  [
    body("title").isLength({ min: 3 }).isString().trim(),
    body("price").isFloat(),
    body("Description")
      .isLength({
        min: 5,
      })
      .trim(),
  ],
  isAuth,
  admincontroller.postAddproduct
);
Router.get("/admin-products", isAuth, admincontroller.getproducts);
Router.get(
  "/edit-product/:productId",

  isAuth,
  admincontroller.getEditproduct
);
Router.post(
  "/edit-product",
  [
    body("title").isLength({ min: 3 }).isString().trim(),

    body("price").isFloat(),
    body("Description")
      .isLength({
        min: 5,
      })
      .trim(),
  ],
  isAuth,
  admincontroller.postEditProduct
);
Router.delete("/product/:productId", isAuth, admincontroller.deleteProduct);

module.exports.routes = Router;
