import { Router } from "express";
import { registerUser,loginUser, logOut,refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js";


const router = Router();

router.route("/register").post(upload.fields([   // after using multer middleware got access to req.files
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverimage",
        maxCount: 1
    }
]),registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logOut)   // after using middleware verfyJWT got access to req.user
router.route("/refresh-token").post(refreshAccessToken)

export default router