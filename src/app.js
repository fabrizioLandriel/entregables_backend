import express from "express";
import path from "path";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import { router as productRouter } from "./routes/productRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import mongoose, { trusted } from "mongoose";
import { messagesModel } from "./dao/models/messagesModel.js";
import sessions from "express-session"
import { initPassport } from './config/passport.config.js';
import passport from "passport";
import connectMongo from 'connect-mongo'

const PORT = 8081;

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions ({
  secret:"CoderCoder123", resave:true, saveUninitialized:true,

    store: connectMongo.create({
    mongoUrl:'mongodb+srv://fabriziolandrielbackend:CoderCoder@cluster0.a6w4x0b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ttl:3600,
    dbName:"eCommerce" 
})}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter)

const server = app.listen(PORT, () =>
  console.log(`Server online en puerto:${PORT}`)
);

export const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("connectionServer", (connectionMessage) => {
    console.log(connectionMessage);
  });
  socket.on("id", async (userName) => {
    let messages = await messagesModel.find();
    socket.emit("previousMessages", messages);
    socket.broadcast.emit("newUser", userName);
  });
  socket.on("newMessage", async (userName, message) => {
    await messagesModel.create({ user: userName, message: message });
    io.emit("sendMessage", userName, message);
  });
});

const connDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://fabriziolandrielbackend:CoderCoder@cluster0.a6w4x0b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "eCommerce",
    }
    );
    console.log("Db on");
  } catch (error) {
    console.log("Error DB", error.message);
  }
};

connDB();
