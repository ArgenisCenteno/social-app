import express from "express";
import {getLikes} from "../controllers/like.js"
import {addLike} from "../controllers/like.js"
import {deleteLike} from "../controllers/like.js"



const router = express.Router();

router.get("/",  getLikes);
router.post("/",  addLike)
router.delete("/",  deleteLike)

export default router;