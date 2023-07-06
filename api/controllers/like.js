import {db} from "../connect.js"
import jwt from "jsonwebtoken";

export const getLikes = (req, res) =>{
    const q = "SELECT userId FROM likes WHERE postId = ?";
    db.query(q, [req.query.postId], (err, data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data.map(like=>like.userId));
    })

    
}

export const addLike = (req, res) =>{
 
    //OBTENER IDUSER EN LAS COOKIES
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("No has iniciado sesión")

    //VALIDAR TOKEN
    jwt.verify(token, "secretKey", (err, userInfo)=> { 
        if(err) return res.status(403).json("Token invalido")

    const q = `INSERT INTO likes ( userId , postId) VALUES (?)`;

    const values = [
        userInfo.id,
        req.body.postId
    ]

    db.query(q, [values], (err, data) =>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("Me gusta agregado");
    }); 
    });
 
};

export const deleteLike = (req, res) =>{
 
    //OBTENER IDUSER EN LAS COOKIES
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("No has iniciado sesión")

    //VALIDAR TOKEN
    jwt.verify(token, "secretKey", (err, userInfo)=> { 
        if(err) return res.status(403).json("Token invalido")

    const q = "DELETE FROM `likes` WHERE `userId` = ? AND `postId` = ?";

     
    db.query(q, [userInfo.id, req.query.postId], (err, data) =>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("Me gusta eliminado");
    }); 
    });
 
};