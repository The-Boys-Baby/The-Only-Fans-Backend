const express = require("express");
const productRouter = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
} = require("../db/products");
const { createOrderItem } = require("../db/orderitem");
const { getActiveOrdersByCustomerId } = require("../db/order");

productRouter.get("/", async (req, res, next) => {
  try {
    const allproducts = await getAllProducts();
    // jeremy: check if the array has length first
    res.send(allproducts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  const params = req.params.productId;
  try {
    const product = await getProductById(params);
    // console.log(product)
    if (!!product) {
      res.send(product);
    } else {
      res.send({
        name: "invalidProductError",
        message: "There is no product with this name",
      });
    }
  } catch (error) {
    next(error);
  }
});

productRouter.post("/:productId", async (req, res, next) => {
  const userId = req.user.id;
  // console.log("this is kenny:", userId)
  const productId = req.params.productId;
  // console.log("this is mike:", productId)
  const { quantity } = req.body;

  if (quantity > 100 || quantity < 1) {
    res
      .status(400)
      .send({ name: "BadQuantityu", message: "Stop changing the quantity" });
  }
  // console.log("This is Dale:", quantity)
  try {
    const userOrder = await getActiveOrdersByCustomerId({ id: userId });
    const getOrder = await getProductById(productId);
    if (userOrder.id && !!getOrder) {
      const createdItem = await createOrderItem({
        orderId: userOrder.id,
        productId: productId,
        quantity,
      });
      const setPrice = await updateOrderTotal({ orderId });
      // jeremy: check if there's a price update success first
      res.send({
        name: "successfullyAdded",
        message: "successfully added item to cart",
        status: "success",
      });
    } else {
      res.send({
        name: "FailedSubmit",
        message: "Failed to add item",
        status: "failed",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productRouter.post("/", async (req, res, next) => {
  const { name, price, description } = req.body;
  try {
    const post = await createProduct({ name, price, description });
    // jeremy: what is a post? try to be a bit better with semantics.
    if (post) {
      res.send(post);
    } else {
      res.send({
        name: "CreatePostError",
        message: "Creating a post error has occurred",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productRouter.post("/:post", async (req, res, next) => {
  const id = req.params.post;
  const fields = {};
  if (req.body.name) {
    fields.name = req.body.name;
  }
  if (req.body.price) {
    fields.price = req.body.price;
  }
  if (req.body.description) {
    fields.description = req.body.description;
  }
  // jeremy: nice, but you can also fields = {...req.body}
  try {
    const post = await updateProduct(id, fields);
    // jeremy: again, try to be more semantic, what is a post?

    if (post) {
      res.send(post);
    } else {
      res.send({
        name: "UpdatePostError",
        message: "Creating a post error has occurred",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productRouter.post("/:post/inactive", async (req, res, next) => {
  const id = req.params.post;
  // jeremy: what's a post, again? this is maybe a productId, but I'm not sure.

  try {
    const post = await deleteProduct(id);
    // console.log(id)
    // console.log(post)
    if (post == true) {
      res.send(post);
    } else {
      next({
        name: "inActiveError",
        message: "This post is not in the system or is already inactive",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = productRouter;
