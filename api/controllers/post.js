import  jwt  from "jsonwebtoken";
import moment from "moment"
import { db } from "../connect.js";
 

//TRAER TODOS LOS POST
export const getPosts = (req, res) =>{
 
    //OBTENER IDUSER EN LAS COOKIES
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("No has iniciado sesión")

    //VALIDAR TOKEN
    jwt.verify(token, "secretKey", (err, userInfo)=> { 
        if(err) return res.status(403).json("Token invalido")

    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM post AS p JOIN user AS u ON (u.id = p.userId)
    LEFT JOIN relacionship AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;

    db.query(q, [userInfo.id, userInfo.id], (err, data) =>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
        
    }); 
     
  
    });

   
};

export const addPosts = (req, res) =>{

    if(req.body.description != "" || req.body.img != ""){

    //OBTENER IDUSER EN LAS COOKIES
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("No has iniciado sesión")

    //VALIDAR TOKEN
    jwt.verify(token, "secretKey", (err, userInfo)=> { 
        if(err) return res.status(403).json("Token invalido")

    const q = `INSERT INTO post ( description , img ,  userId ,  createdAt ) VALUES (?)`;

    const values = [
        req.body.description,
        req.body.img,
        userInfo.id,
        moment(Date.now()).format("YYYY-MM-DD HH-mm-ss")
    ]

    db.query(q, [values], (err, data) =>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("Post creado correctamente");
    }); 
     
 
    });
    }else{
        return res.status(500).json("No puede haber campos vacíos");
    } 
 
 
};

export const deletePost = (req, res ) =>{
 //OBTENER IDUSER EN LAS COOKIES
 const token = req.cookies.accessToken;
 if(!token) return res.status(401).json("No has iniciado sesión")

 //VALIDAR TOKEN
 jwt.verify(token, "secretKey", (err, userInfo)=> { 
     if(err) return res.status(403).json("Token invalido")

 const q = "DELETE FROM post WHERE `id`= ? AND `userId` = ?";
 
 db.query(q, [req.params.id, userInfo.id], (err, data) =>{
     if(err) return res.status(500).json(err);
     if(data.affectedRows>0) return res.status(200).json("Post eliminado correctamente");
     return res.status(403).json("No estas autorizado para eliminar este post ")
 }); 
  

 });
}