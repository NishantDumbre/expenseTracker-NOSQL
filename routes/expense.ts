import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import expenseController = require("../controllers/expense");

const router: Router = express.Router();

router.post(
  "/add-record",
  authenticate,
  expenseController.postExpense
);
router.get(
  "/get-record",
  authenticate,
  expenseController.getExpense
);
router.delete(
  "/delete-record/:id",
  authenticate,
  expenseController.deleteExpense
);

module.exports = router;
