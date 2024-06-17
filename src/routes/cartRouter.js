import { Router } from "express";
export const router = Router();
import { cartController } from "../controller/cartController.js";

router.get("/", cartController.getCart);

router.post("/", cartController.addCart);

router.get("/:cid", cartController.getCartById);

router.post("/:cid/product/:pid", cartController.addProductToCart);

router.delete("/:cid/product/:pid", cartController.deleteProductInCart);

router.put("/:cid/product/:pid", cartController.updateProductInCart);

router.delete("/:cid", cartController.deleteAllInCart);

router.put("/:cid", cartController.updateCart);
