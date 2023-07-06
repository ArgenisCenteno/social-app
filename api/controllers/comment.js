import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comment AS c JOIN user AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComments = (req, res) =>{

  if(req.body.description != ""){
        //OBTENER IDUSER EN LAS COOKIES
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("No has iniciado sesión")

    //VALIDAR TOKEN
    jwt.verify(token, "secretKey", (err, userInfo)=> { 
        if(err) return res.status(403).json("Token invalido")

    const q = `INSERT INTO comment ( description , createdAt ,  userId ,  postId ) VALUES (?)`;

    const values = [
        req.body.description,
        moment(Date.now()).format("YYYY-MM-DD HH-mm-ss"),
        userInfo.id,
        req.body.postId
       
    ]

    db.query(q, [values], (err, data) =>{
        if(err) return res.status(500).json(err);
        return res.status(200).json("Comentario creado correctamente");
    }); 
     
 
    });
  }
 

 
};