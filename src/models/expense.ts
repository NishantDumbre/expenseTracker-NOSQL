import mongoose, { Schema, Document, Model } from "mongoose";

interface IExpense extends Document {
  money: number;
  description: string;
  category: string;
  user_id: string;
  type: string;
}

const ExpenseSchema: Schema<IExpense> = new Schema({
  money: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});


const Expense: Model<IExpense> = mongoose.model<IExpense>("expense", ExpenseSchema);
export default Expense

