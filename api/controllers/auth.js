import { db } from "../connect.js";
import  bcrypt  from "bcryptjs"
import   Jwt   from "jsonwebtoken";

//LOGIN
export const login = (req, res) =>{
  if(req.body.username != ""  && req.body.password != ""){

   //CONSULTAR SI EL USUARIO YA EXISTE
  const q = "SELECT * FROM user WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Usuario o contraseña incorrecta");
     
    //COMPARAR CONTRASEÑAS
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if(!checkPassword) return res.status(400).json("Usuario o contraseña incorrecta ")
    
    //CREAR TOKEN
    const token = Jwt.sign({id:data[0].id}, "secretKey" );
    const {password, ...other} = data[0];

    res.cookie("accessToken", token,{
      httpOnly: true,
    }).status(200).json(other);
 
  })
   
}else{
  return res.status(500).json("Todos los campos son obligatorios");
}
}

//REGISTER
export const register =   (req, res) => {

  if(req.body.username != "" && req.body.name != "" && req.body.email != "" && req.body.password != ""){
    //CONSULTAR SI EL USUARIO YA EXISTE
  
    const q = "SELECT * FROM user WHERE username = ?";
  
    db.query(q, [req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("Este usuario se encuentra registrado");
    //CREAR USUARIO
      //ENCRIPTAR CLAVE
      const salt =   bcrypt.genSaltSync(10);
      const hashedPassword =  bcrypt.hashSync(req.body.password, salt);
  
      const q =
        "INSERT INTO user (`username`,`email`,`password`,`name`) VALUE (?)";
  
      const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.name,
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Usuario creado correctamente");
      });
    });
  }else{
    return res.status(500).json("Todos los campos son obligatorios");
  }

  }
    

//LOGOUT
export const logout = (req, res) =>{
    //LIMPIAR COOKIE
    res.clearCookie("accessToken",{
      secure: true,
      sameSite: "none", 
    }).status(200).json("Usuario cerró sesion")
}