import { Product } from "../models/product.model.js"

 const getProducts = async(req,resp) => {
    try {
        const products = await Product.find();
        resp.status(201).send({
            message:"got data",
            data:products
        })
    } catch (error) {
        console.log(error);
        
    }
}
export { getProducts }