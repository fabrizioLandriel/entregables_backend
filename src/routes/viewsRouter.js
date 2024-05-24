import { Router } from "express";
export const router = Router();
import ProductManager from "../dao/ProductManagerDB.js";
import CartManager from "../dao/CartManagerDB.js";
const productManager = new ProductManager();
const cartManager = new CartManager();
import { auth } from "../middleware/auth.js";

router.get("/", async (req, res) => {
  let usuario = req.session.usuario
  let { limit, sort, page, ...filters } = req.query;
  let { payload: products,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink, } = await productManager.getProducts(
    limit,
    page,
    sort,
    filters
  );

  res.status(200).render("home", { products, usuario, 
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink });
});

router.get("/realTimeProducts", async (req, res) => {
  let { payload: products } = await productManager.getProducts();
  res.status(200).render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});

router.get("/carts/:cid", async (req, res) => {
  let cid = req.params.cid;
  let cart = await cartManager.getCartById(cid);
  cart = cart.products.map((c) => c.toJSON());
  res.status(200).render("carts", { cart });
});

router.get('/',(req,res)=>{

  res.status(200).render('home')
})

router.get('/registro',(req,res)=>{

  res.status(200).render('registro')
})

router.get('/login',(req,res)=>{

  let {error}=req.query

  res.status(200).render('login', {error})
})

router.get('/perfil', auth, (req,res)=>{

  res.status(200).render('perfil',{
      usuario:req.session.usuario
  })
})
