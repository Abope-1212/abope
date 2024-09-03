const path = require("path");
const express = require("express");

const shopcontroller = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const Router = express.Router();

Router.get("/", shopcontroller.getIndex);
Router.get("/product", shopcontroller.getproduct);
Router.get("/products/:productId", shopcontroller.getproductid);
Router.get("/cart", isAuth, shopcontroller.getcart);
Router.post("/cart", isAuth, shopcontroller.postcart);
Router.post("/cart-delete-item", isAuth, shopcontroller.postcartDeleteProduct);
Router.get("/orders", isAuth, shopcontroller.getorders);
Router.get("/checkout", isAuth, shopcontroller.getcheckout);
Router.get("/checkout/success", shopcontroller.postOrder);
Router.get("checkout/cancel", shopcontroller.getcheckout);
// Router.post("/orders", isAuth, shopcontroller.postOrder);
Router.get("/orders/:orderId", isAuth, shopcontroller.getInvoice);

module.exports = Router;
