import  express   from "express";
import userRouter from "./routes/users.js" 
import relationshipRoutes from "./routes/relationships.js" 
import postRouter from "./routes/posts.js"
import commentRouter from "./routes/comments.js"
import likesRouter from "./routes/likes.js"
import storiesRouter from "./routes/stories.js"
import authRouter from "./routes/auth.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import  multer   from  'multer'; 

const app = express();
 
//midlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json());
app.use(cors({origin: "http://localhost:3000"}));
app.use(cookieParser())


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
const upload = multer({storage: storage})

app.post("/api/upload/", upload.single("file"), (req, res) =>{
    const file = req.file;
    res.status(200).json(file.filename);
});
 
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likesRouter);
app.use("/api/stories", storiesRouter);
app.use("/api/users", userRouter);
app.use("/api/relationships", relationshipRoutes);

app.listen(8800, ()=>{
    console.log("Api marchando")
})