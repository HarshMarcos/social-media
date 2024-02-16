import { Router } from "express";
import {
  editProfile,
  getProfile,
  getUserProfile,
  getUsers,
} from "../controller/userController.js";

const router = Router();

router.get("/user", getProfile);
router.put("/edit-profile", editProfile);
router.get("/user-profilr/:userId", getUserProfile);
router.get("/allusers", getUsers);

export default router;
