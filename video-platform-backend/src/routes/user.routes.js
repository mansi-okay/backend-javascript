import { Router } from "express";
import { registerUser,loginUser, logOut,refreshAccessToken,changeCurrentPassword, getCurrentUser,updateAccountDetails,updateAvatar,updateCoverImage,getUserChannelProfile} from "../controllers/user.controller.js";
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
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/update-avatar").patch(upload.single("avatar"),verifyJWT,updateAvatar)
router.route("/update-coverimage").patch(upload.single("coverimage"),verifyJWT,updateCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)


export default router