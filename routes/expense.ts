import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import { postExpense, getExpense, deleteExpense } from "../controllers/expense";

const router: Router = express.Router();

router.post("/add-record", authenticate, postExpense);
router.get("/get-record", authenticate, getExpense);
router.delete("/delete-record/:id", authenticate, deleteExpense);

export default router;
