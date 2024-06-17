import { productsModel } from "./models/productsModel.js";

export default class ProductManager {
  async add({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [], // tambien pasar en el body de la request como array
  }) {
    let productAdded = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    await productsModel.create(productAdded);
  }

  async get(limit = 10, page = 1, price, query) {
    if (price == "asc") {
      price = 1;
    } else {
      price = -1;
    }
    let options = {
      limit,
      page,
      lean: true,
      sort: price ? { price } : undefined,
    };

    let filter = query ? query : {};

    try {
      let {
        docs: payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      } = await productsModel.paginate(filter, options);

      let paginationInfo = {
        status: "success",
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/?page=${prevPage}` : null,
        nextLink: hasNextPage ? `/?page=${nextPage}` : null,
      };

      return paginationInfo;
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async getBy(filtro) {
    return await productsModel.findOne(filtro);
  }

  async update(id, productData) {
    // ---> 'PRODUCTDATA' se pasa por el body de postman<---
    return await productsModel.findByIdAndUpdate(id, productData, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async delete(productId) {
    return await productsModel.deleteOne({ _id: productId });
  }
}
