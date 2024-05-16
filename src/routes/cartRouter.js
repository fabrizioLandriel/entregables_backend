import { Router } from "express";
export const router = Router();
import CartManager from "../dao/CartManagerDB.js";

import { isValidObjectId } from "mongoose";
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    let getAllCarts = await cartManager.getCarts();
    res.json({ getAllCarts });
  } catch (error) {
    res.status(500).json({ error: `error getting carts: ${error.message}` });
  }
});

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    let carts = await cartManager.getCarts();
    res.json({
      payload: `Cart created!`,
    });
  } catch (error) {
    res.status(300).json({ error: "error creating cart" });
  }
});

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  try {
    let cartById = await cartManager.getCartById(cid);
    if (!cartById) {
      return res.status(300).json({ error: "Cart not found" });
    } else {
      res.json({ cartById });
    }
  } catch (error) {
    res
      .status(300)
      .json({ error: `error getting cart ${cid}, ${error.message}` });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;

  if (!isValidObjectId(cid, pid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  if (!cid || !pid) {
    return res.status(300).json({ error: "Check unfilled fields" });
  }

  try {
    await cartManager.addProducts(cid, pid);
    let cartUpdated = await cartManager.getCartById(cid);
    res.json({ payload: cartUpdated });
  } catch (error) {
    res
      .status(300)
      .json({ error: `error when adding product ${pid} to cart ${cid}` });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  if (!cid || !pid) {
    return res.status(300).json({ error: "Check unfilled fields" });
  }

  try {
    await cartManager.deleteProduct(cid, pid);
    return res.json({ payload: `Product ${pid} deleted from cart ${cid}` });
  } catch (error) {
    return res.json({ error: `${error.message}` });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  let { cid, pid } = req.params;
  let { quantity } = req.body;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  if (!cid || !pid) {
    return res.status(300).json({ error: "Check unfilled fields" });
  }

  try {
    await cartManager.updateCartProducts(cid, pid, quantity);
    res.json({ payload: `Product ${pid} updated` });
  } catch (error) {
    return res.status(300).json({ error: `${error.message}` });
  }
});

router.delete("/:cid", async (req, res) => {
  let { cid } = req.params;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  if (!cid) {
    return res.status(300).json({ error: "Check unfilled fields" });
  }

  try {
    await cartManager.deleteAllProducts(cid);
    res.json({ payload: `Products deleted from cart ${cid}` });
  } catch (error) {
    return res.status(500).json({ error: `${error.message}` });
  }
});

router.put("/:cid", async (req, res) => {
  let { cid } = req.params;
  let toUpdate = req.body;
  if (!isValidObjectId(cid)) {
    return res.status(400).json({
      error: `Enter a valid MongoDB id`,
    });
  }

  if (!cid) {
    return res.status(300).json({ error: "Cart ID is missing" });
  }

  try {
    await cartManager.updateCart(cid, toUpdate);
    res.json({ payload: `Cart ${cid} updated` });
  } catch (error) {
    return res.status(300).json({ error: `${error.message}` });
  }
});
