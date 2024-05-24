import { Router } from "express";
export const router = Router();
import { UsuariosManagerMongo } from "../dao/userManagerDB.js";
import { generaHash } from "../utils.js";
import passport from "passport";

const usuarioManager = new UsuariosManagerMongo();

router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`Fallo al autenticar`
        }
    )
    
})

router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), async(req,res)=>{

    // let {nombre, email, password}=req.body
    // if(!nombre || !email || !password){
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(400).json({error:`Complete nombre, email, y password`})
    // }

    // let existe=await usuarioManager.getBy({email})
    // if(existe){
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(400).json({error:`Ya existe ${email}`})
    // }

    // password=generaHash(password)

    // try {
    //     let nuevoUsuario=await usuarioManager.create({nombre, email, password, rol:"user"})
    //     res.setHeader('Content-Type','application/json')
    //     res.status(200).json({
    //         message:"Registro correcto", nuevoUsuario
    //     })
    // } catch (error) {
    //     console.log(error);
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(500).json(
    //         {
    //             error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
    //             detalle:`${error.message}`
    //         }
    //     )
    // }

    res.setHeader('Content-Type','application/json');
    return res.status(201).json({mensaje:"Registro OK", nuevoUsuario:req.user});

})

router.post("/login", passport.authenticate("login", {failureRedirect:"/api/sessions/error"}), async(req, res)=>{
    let {email, password, web}=req.body

    // console.log(req.body)
    // if(!email || !password){
    //     if(web){
    //         return res.redirect(`/login?error=Complete email, y password`)
    //     }else{
    //         res.setHeader('Content-Type','application/json');
    //         return res.status(400).json({error:`Complete email, y password`})
    //     }
    // }


    // let usuario=await usuarioManager.getBy({email, password:generaHash(password)})
    // if(!usuario){
    //     if(web){
    //         return res.redirect(`/login?error=Credenciales invalidas`)
    //     }else{
    //         res.setHeader('Content-Type','application/json');
    //         return res.status(400).json({error:`Credenciales inválidas`})
    //     }
    // }

    // usuario={...usuario}
    // delete usuario.password
    // req.session.usuario=usuario

    // if(web){
    //     res.redirect("/perfil")
    // }else{
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(200).json({payload:"Login correcto", usuario});
    // }

    let usuario={...req.user}
    delete usuario.password
    req.session.usuario=usuario

    if(web){
        res.redirect("/perfil")
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login correcto", usuario});
    }
    

})

router.get('/github', passport.authenticate("github", {}), (req,res)=>{})

router.get('/githubCb', passport.authenticate("github", {failureRedirect:"/api/sessions/error"}), (req,res)=>{

    req.session.usuario=req.user

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:req.user});
})

router.get("/logout", (req, res)=>{
    req.session.destroy(e=>{
        if(e){
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
            
        }
    })

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Logout Exitoso"});
})


