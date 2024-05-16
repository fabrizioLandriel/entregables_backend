import { cartsModel } from "./models/cartsModel.js";
import ProductManager from "./ProductManagerDB.js";
const productManager = new ProductManager();

export default class CartManager {
  async createCart() {
    await cartsModel.create({ products: [] });
  }

  async getCarts() {
    const carts = await cartsModel.find().populate("products.product");
    return carts;
  }

  async getCartById(idCart) {
    const searchCart = await cartsModel
      .findOne({ _id: idCart })
      .populate("products.product");
    return searchCart;
  }

  async addProducts(idCart, idProduct) {
    try {
      let searchCart = await this.getCartById(idCart);
      let isProductInCart = false;
      searchCart.products.forEach((p) => {
        let product = p.product;

        if (product._id == idProduct) {
          p.quantity = p.quantity + 1;
          isProductInCart = true;
        }
      });

      if (!isProductInCart) {
        let producto = await productManager.getProductsBy({ _id: idProduct });
        searchCart.products.push({ product: producto._id, quantity: 1 });
      }

      await searchCart.save();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(idCart, idProduct) {
    try {
      let searchCart = await this.getCartById(idCart);
      searchCart.products = searchCart.products.filter(
        (p) => p.product._id != idProduct
      );
      await searchCart.save();
    } catch (error) {
      return `Error: product ${idProduct} not found`;
    }
  }

  async updateCartProducts(idCart, idProduct, quantityUpdate) {
    try {
      let searchCart = await this.getCartById(idCart);
      searchCart.products.forEach((p) => {
        let product = p.product;

        if (product._id == idProduct) {
          p.quantity = quantityUpdate;
        }
      });
      await searchCart.save();
    } catch (error) {
      return `Error: product ${idProduct} not found`;
    }
  }

  async deleteAllProducts(idCart) {
    try {
      let searchCart = await this.getCartById(idCart);

      if (searchCart) {
        searchCart.products.splice(0, searchCart.products.length);
        searchCart.save();
      }
    } catch (error) {
      return `Error: product ${id} not found`;
    }
  }
  async updateCart(idCart, toUpdate) {
    try {
      let searchCart = await this.getCartById(idCart);

      if (searchCart) {
        await this.deleteAllProducts(idCart);
        searchCart.products.push({});
      }

      await searchCart.save();
    } catch (error) {
      return `Error:  ${error.message} `;
    }
  }
}
