import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { changeCurrentPassword, loginUser, refreshAccessToken } from "../controllers/user.controllers.js";
import { logoutUser, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/update-password").post(verifyJWT, changeCurrentPassword)
router.route("/changeAvatar").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]),updateUserAvatar)

export default router