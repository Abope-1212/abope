const mongoose = require("mongoose");
const fileHelper = require("../util/file");

const Product = require("../models/product");
const { validationResult } = require("express-validator/lib");

// const ObjectId = mongodb.ObjectId;

exports.getAddproduct = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddproduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const image = req.file;
  const Description = req.body.Description;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        Description: Description,
      },
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        Description: Description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    Description: Description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("CREATED PRODUCT");
      res.redirect("/");
    })
    .catch((err) => {
      // res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/add-product",
      // editing: false,
      // hasError: true,
      // product: {
      //   title: title,
      //   imageUrl: imageUrl,
      //   price: price,
      //   Description: Description,
      // },
      // errorMessage: "Database opration failed, please try again",
      // validationErrors: [],
      // });
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditproduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/edit-product",
        editing: editMode,
        hasError: false,
        errorMessage: null,
        product: product,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedtitle = req.body.title;
  const updatedprice = req.body.price;
  const image = req.file;
  const updatedDescription = req.body.Description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedtitle,
        price: updatedprice,
        Description: updatedDescription,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedtitle;

      product.price = updatedprice;
      product.Description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.imageUrl, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            // Optionally, you can set a flash message or handle the error accordingly
          }
        });
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin-products");
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getproducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price-_id')
    // .populate('userId', 'name')
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin-products",
        path: "/admin-products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not Found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed." });
    });
};
