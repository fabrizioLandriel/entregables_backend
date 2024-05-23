import { userModel } from "./models/userModel.js";

export class UsuariosManagerMongo{

    async create(usuario){
        let nuevoUsuario=await userModel.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro={}){
        return await userModel.findOne(filtro).lean()
    }

}