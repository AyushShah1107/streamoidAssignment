import  express  from "express";
import  cors from "cors";

const app = express();
app.use(cors());

app.get("/",(req,resp)=>{
    resp.send({
        message:"backend running",
        status:200
    })
})


app.listen(4000,()=>{
    console.log(`backend running on port 4000`);
    
})