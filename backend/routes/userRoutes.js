import {Router} from "express";
import {createUser, loginUser, addToHistory, getUserHistory, logoutUser} from "../controllers/userController.js"

const router = Router();


router.route("/register").post(createUser)

router.route("/login").post(loginUser)

router.route("/add_to_activity").post(addToHistory)

router.route("/get_all_activity").get(getUserHistory)

router.post("/logout", logoutUser);

export default router;
