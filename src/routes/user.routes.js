import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router=Router()


router.route("/register").post(
    //upload is multer middleware 
    upload.fields([
        {
            name:"avatar",
            maxCount:1 // how many file u going to receive
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
    
    )

export default router