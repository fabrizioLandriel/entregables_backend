import { io } from "../app.js";
import { isValidObjectId } from "mongoose";
import ProductManager from "../dao/ProductMongoDAO.js";
const productManager = new ProductManager();

export class productoController {
    static getProducts = async (req, res) => {
        try {
          let products = await productManager.get();
          let limit = req.query.limit;
      
          limit = Number(limit);
          let pdata = products;
          if (limit && limit > 0) {
            pdata = pdata.slice(0, limit);
          } else {
            pdata;
          }
          res.json(pdata);
        } catch (error) {
          res.status(400).json({ error: `${error.message}` });
        }
      }

    static getProductById = async (req, res) => {
      let { pid } = req.params;
      if (!isValidObjectId(pid)) {
        return res.status(400).json({
          error: `Ingrese un id valido de MongoDB`,
        });
      }
      try {
        let product = await productManager.getBy({ _id: pid });
        if (product) {
          res.json({ product });
        } else {
          return res.json({ error: `Product not found` });
        }
      } catch (error) {
        res.status(400).json({ error: `Product ${pid} not found` });
      }
    }

    static addProduct = async (req, res) => {
      let { title, description, code, price, status, stock, category, thumbnails } =
        req.body;
      if (!title || !description || !code || !price || !stock || !category)
        return res.json({ error: "Check unfilled fields" });
    
      let exist;
      try {
        exist = await productManager.getBy({ code });
      } catch (error) {
        return res.status(500).json({
          error: `${error.message}`,
        });
      }
    
      if (exist) {
        return res
          .status(400)
          .json({ error: `Product with code ${code} is already registered` });
      }
    
      try {
        await productManager.add({ ...req.body });
        let productList = await productManager.get();
        io.emit("updateProducts", productList);
        return res.json({ payload: `Product added` });
      } catch (error) {
        res.status(300).json(`{error: ${error.message}}`);
      }
    }

    static updateProduct = async (req, res) => {
      let { pid } = req.params;
      if (!isValidObjectId(pid)) {
        return res.status(400).json({
          error: `Enter a valid MongoDB id`,
        });
      }
    
      let toUpdate = req.body;
    
      if (toUpdate._id) {
        delete toUpdate._id;
      }
    
      if (toUpdate.code) {
        let exist;
        try {
          exist = await productManager.getBy({ code: toUpdate.code });
          if (exist) {
            return res.status(400).json({
              error: `There is already another product with the code ${toUpdate.code}`,
            });
          }
        } catch (error) {
          return res.status(500).json({
            error: `${error.message}`,
          });
        }
      }
    
      try {
        const products = await productManager.update(pid, toUpdate);
        return res.json(products);
      } catch (error) {
        res.status(300).json({ error: "Error when modifying the product" });
      }
    }

    static deleteProduct = async (req, res) => {
      let { pid } = req.params;
      if (!isValidObjectId(pid)) {
        return res.status(400).json({
          error: `Enter a valid MongoDB id`,
        });
      }
      try {
        let products = await productManager.delete(pid);
        if (products.deletedCount > 0) {
          let productList = await productManager.get();
          io.emit("deleteProducts", productList);
          return res.json({ payload: `Product ${pid} deleted` });
        } else {
          return res.status(404).json({ error: `Product ${id} doesnt exist` });
        }
      } catch (error) {
        res.status(300).json({ error: `Error deleting product ${pid}` });
      }
    }
}