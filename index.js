import  express  from "express";
import  cors from "cors";
import { dataRouter } from "./routes/dataRouter.js";

const app = express();
app.use(cors());
app.use("/api/v1",dataRouter)
app.get("/",(req,resp)=>{
    resp.send({
        message:"backend running",
        status:200
    })
})


app.listen(4000,()=>{
    console.log(`backend running on port 4000`);
    
})