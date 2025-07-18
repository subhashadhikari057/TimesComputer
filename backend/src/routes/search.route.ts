import express from "express";
import { searchFilter } from "../controllers/search.controller";
const router = express.Router();

router.route("/").get(searchFilter);

export default router;