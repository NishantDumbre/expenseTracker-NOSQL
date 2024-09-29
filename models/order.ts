import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrder extends Document {
  payment_id: string;
  order_id: string;
  status: string;
}

const OrderSchema: Schema<IOrder> = new Schema({
  payment_id: {
    type: String,
  },
  order_id: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Order: Model<IOrder> = mongoose.model<IOrder>("order", OrderSchema);
export default Order
