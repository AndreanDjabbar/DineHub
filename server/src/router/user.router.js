import express from "express";
import * as UserController from "../controller/user.controller.js";

const router = express.Router();

router.post(
  "/create-tenant",
  UserController.createTenantController
);

export default router;