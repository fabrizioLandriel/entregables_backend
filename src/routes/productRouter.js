import { Router } from "express";
export const router = Router();

import { productoController as productController } from "../controller/productoController.js";

router.get("/", productController.getProducts );

router.get("/:pid", productController.getProductById);

router.post("/", productController.addProduct );

router.put("/:pid", productController.updateProduct);

router.delete("/:pid", productController.deleteProduct);
